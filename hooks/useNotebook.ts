'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Notebook } from '@/types/chat/database';

export const useNotebook = (notebookId: string) => {
  const {
    data: notebook,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['notebook', notebookId],
    queryFn: async () => {
      if (!notebookId) {
        console.log('No notebook ID provided, returning null');
        return null;
      }
      
      console.log('Fetching notebook:', notebookId);
      
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .eq('id', notebookId)
        .single();

      if (error) {
        console.error('Error fetching notebook:', error);
        throw error;
      }

      console.log('Fetched notebook:', data);
      return data as Notebook;
    },
    enabled: !!notebookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    notebook,
    isLoading,
    error: error?.message || null,
    isError,
  };
};
