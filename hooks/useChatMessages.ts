'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { EnhancedChatMessage, Citation, MessageSegment } from '@/types/message';

// Type for the expected message structure from n8n_chat_histories
interface N8nMessageFormat {
  type: 'human' | 'ai';
  content: string | {
    segments: MessageSegment[];
    citations: Citation[];
  };
  additional_kwargs?: any;
  response_metadata?: any;
  tool_calls?: any[];
  invalid_tool_calls?: any[];
}

const transformMessage = (item: any, sourceMap: Map<string, any>): EnhancedChatMessage => {
  console.log('Processing item:', item);
  
  let transformedMessage: EnhancedChatMessage['message'];
  
  if (item.message && 
      typeof item.message === 'object' && 
      !Array.isArray(item.message) &&
      'type' in item.message && 
      'content' in item.message) {
    
    const messageObj = item.message as unknown as N8nMessageFormat;
    
    // Check if this is an AI message with JSON content that needs parsing
    if (messageObj.type === 'ai' && typeof messageObj.content === 'string') {
      try {
        const parsedContent = JSON.parse(messageObj.content);
        
        // Check for the old format with output array
        if (parsedContent.output && Array.isArray(parsedContent.output)) {
          console.log('Found old format with output array');
          
          const segments: MessageSegment[] = [];
          const citations: Citation[] = [];
          let citationIdCounter = 1;
          
          parsedContent.output.forEach((outputItem: any) => {
            segments.push({
              text: outputItem.text,
              citation_id: outputItem.citations && outputItem.citations.length > 0 ? citationIdCounter : undefined
            });

            if (outputItem.citations && outputItem.citations.length > 0) {
              outputItem.citations.forEach((citation: any) => {
                console.log('🔍 Citation from n8n:', {
                  raw_citation: citation,
                  chunk_source_id: citation.chunk_source_id,
                  chunk_text: citation.chunk_text,
                  chunk_lines_from: citation.chunk_lines_from,
                  chunk_lines_to: citation.chunk_lines_to,
                  sourceMap_size: sourceMap.size,
                  sourceMap_keys: Array.from(sourceMap.keys()),
                  sourceInfo: sourceMap.get(citation.chunk_source_id)
                });

                // Try to find source info by chunk_source_id first
                let sourceInfo = sourceMap.get(citation.chunk_source_id);
                let actualSourceId = citation.chunk_source_id;

                // If not found and sourceMap has exactly 1 source, use that source
                // (This is a workaround for n8n returning wrong chunk_source_id)
                if (!sourceInfo && sourceMap.size === 1) {
                  const firstSourceEntry = Array.from(sourceMap.entries())[0];
                  actualSourceId = firstSourceEntry[0];
                  sourceInfo = firstSourceEntry[1];
                  console.log('⚠️ Using fallback source mapping:', {
                    n8n_chunk_source_id: citation.chunk_source_id,
                    actual_source_id: actualSourceId,
                    source_title: sourceInfo?.title
                  });
                }

                citations.push({
                  citation_id: citationIdCounter,
                  source_id: actualSourceId,  // Use the corrected source ID
                  source_title: sourceInfo?.title || 'Unknown Source',
                  source_type: sourceInfo?.type || 'pdf',
                  chunk_lines_from: citation.chunk_lines_from,
                  chunk_lines_to: citation.chunk_lines_to,
                  chunk_index: citation.chunk_index,
                  excerpt: citation.chunk_text || `Lines ${citation.chunk_lines_from}-${citation.chunk_lines_to}`
                });
              });
              citationIdCounter++;
            }
          });
          
          transformedMessage = {
            type: 'ai',
            content: {
              segments,
              citations
            },
            additional_kwargs: messageObj.additional_kwargs,
            response_metadata: messageObj.response_metadata,
            tool_calls: messageObj.tool_calls,
            invalid_tool_calls: messageObj.invalid_tool_calls
          };
        } else {
          // Fallback for AI messages that don't match expected format
          transformedMessage = {
            type: 'ai',
            content: messageObj.content,
            additional_kwargs: messageObj.additional_kwargs,
            response_metadata: messageObj.response_metadata,
            tool_calls: messageObj.tool_calls,
            invalid_tool_calls: messageObj.invalid_tool_calls
          };
        }
      } catch (parseError) {
        console.log('Failed to parse AI content as JSON, treating as plain text:', parseError);
        transformedMessage = {
          type: 'ai',
          content: messageObj.content,
          additional_kwargs: messageObj.additional_kwargs,
          response_metadata: messageObj.response_metadata,
          tool_calls: messageObj.tool_calls,
          invalid_tool_calls: messageObj.invalid_tool_calls
        };
      }
    } else {
      transformedMessage = {
        type: messageObj.type === 'human' ? 'human' : 'ai',
        content: messageObj.content || 'Empty message',
        additional_kwargs: messageObj.additional_kwargs,
        response_metadata: messageObj.response_metadata,
        tool_calls: messageObj.tool_calls,
        invalid_tool_calls: messageObj.invalid_tool_calls
      };
    }
  } else if (typeof item.message === 'string') {
    transformedMessage = {
      type: 'human',
      content: item.message
    };
  } else {
    transformedMessage = {
      type: 'human',
      content: 'Unable to parse message'
    };
  }

  console.log('Transformed message:', transformedMessage);

  return {
    id: item.id,
    session_id: item.session_id,
    message: transformedMessage
  };
};

export const useChatMessages = (sessionId: string, notebookId: string) => {
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];

      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: true});

      if (error) throw error;

      // Also fetch sources to get proper source titles
      const { data: sourcesData } = await supabase
        .from('sources')
        .select('id, title, type')
        .eq('notebook_id', notebookId);

      const sourceMap = new Map((sourcesData as any[] | null)?.map((s: any) => [s.id, s]) || []);

      console.log('Raw data from database:', data);
      console.log('Sources map:', sourceMap);

      return data.map((item) => transformMessage(item, sourceMap));
    },
    enabled: !!sessionId && !!notebookId,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Set up Realtime subscription for new messages
  useEffect(() => {
    if (!sessionId || !notebookId) return;

    console.log('Setting up Realtime subscription for session:', sessionId);

    const channel = supabase
      .channel(`chat-messages-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'n8n_chat_histories',
          filter: `session_id=eq.${sessionId}`
        },
        async (payload) => {
          console.log('Realtime: New message received:', payload);

          // Fetch sources for proper transformation
          const { data: sourcesData } = await supabase
            .from('sources')
            .select('id, title, type')
            .eq('notebook_id', notebookId);

          const sourceMap = new Map((sourcesData as any[] | null)?.map((s: any) => [s.id, s]) || []);

          const newMessage = transformMessage(payload.new, sourceMap);

          queryClient.setQueryData(['chat-messages', sessionId], (oldMessages: EnhancedChatMessage[] = []) => {
            const messageExists = oldMessages.some(msg => msg.id === newMessage.id);
            if (messageExists) {
              console.log('Message already exists, skipping:', newMessage.id);
              return oldMessages;
            }

            console.log('Adding new message to cache:', newMessage);
            return [...oldMessages, newMessage];
          });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up Realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [sessionId, notebookId, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async (messageData: {
      sessionId: string;
      notebookId: string;
      content: string;
    }) => {
      const requestBody = {
        session_id: messageData.sessionId,
        notebook_id: messageData.notebookId,
        message: messageData.content,
        user_id: 'public-user'
      };

      console.log('📤 Sending to webhook:', requestBody);

      const webhookResponse = await supabase.functions.invoke('send-chat-message', {
        body: requestBody
      });

      console.log('📥 Webhook response:', webhookResponse);

      if (webhookResponse.error) {
        throw new Error(`Webhook error: ${webhookResponse.error.message}`);
      }

      return webhookResponse.data;
    },
    onSuccess: () => {
      console.log('✅ Message sent to webhook successfully');
    },
  });

  return {
    messages,
    isLoading,
    error: error?.message || null,
    sendMessage: sendMessage.mutate,
    sendMessageAsync: sendMessage.mutateAsync,
    isSending: sendMessage.isPending,
    refetch
  };
};
