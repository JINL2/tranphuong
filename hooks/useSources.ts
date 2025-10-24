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

      // Fetch all fields including content (InsightsLM approach)
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .eq('notebook_id', notebookId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sources:', error);
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
