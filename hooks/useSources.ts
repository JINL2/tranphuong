'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Source } from '@/types/chat/database';

export const useSources = (notebookId: string) => {
  const {
    data: sources = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sources', notebookId],
    queryFn: async () => {
      if (!notebookId) return [];

      console.log('Fetching sources for notebook:', notebookId);
      console.log('Supabase client configured:', {
        hasClient: !!supabase
      });

      // Fetch all fields including content (InsightsLM approach)
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .eq('notebook_id', notebookId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ SUPABASE ERROR - Error fetching sources');
        console.error('Error object:', error);
        console.error('Error message:', error?.message || 'No message');
        console.error('Error details:', error?.details || 'No details');
        console.error('Error hint:', error?.hint || 'No hint');
        console.error('Error code:', error?.code || 'No code');

        // Log all error properties
        console.error('Error properties:', {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code,
          keys: Object.keys(error || {})
        });

        throw error;
      }

      console.log('useSources: Fetched sources DETAILED', {
        count: data?.length || 0,
        sources: (data as any[] | null)?.map((s: any) => ({
          id: s.id,
          title: s.title,
          type: s.type,
          hasContent: !!s.content,
          contentLength: s.content?.length,
          hasSummary: !!s.summary
        }))
      });

      return data as Source[];
    },
    enabled: !!notebookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    sources,
    isLoading,
    error: error?.message || null,
  };
};
