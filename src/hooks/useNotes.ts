import React, { useEffect, useState } from 'react';
import { DailyNote } from '@/types';
import { supabase } from '@/services/supabase';
import { useUserStore } from '@/stores/userStore';
import { format } from 'date-fns';

interface UseNotesParams {
  categoryId?: string;
  subcategoryId?: string;
  date?: Date;
}

export function useNotes({ categoryId, subcategoryId, date = new Date() }: UseNotesParams = {}) {
  const { user } = useUserStore();
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('daily_notes')
          .select('*')
          .eq('user_id', user.id)
          .eq('note_date', format(date, 'yyyy-MM-dd'))
          .order('sort_order', { ascending: true });

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        } else {
          query = query.is('category_id', null);
        }

        if (subcategoryId) {
          query = query.eq('subcategory_id', subcategoryId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setNotes(data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user?.id, categoryId, subcategoryId, date]);

  const addNote = async (content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_notes')
        .insert({
          user_id: user.id,
          category_id: categoryId || null,
          subcategory_id: subcategoryId || null,
          content,
          note_date: format(date, 'yyyy-MM-dd'),
        })
        .select()
        .single();

      if (error) throw error;

      setNotes([...notes, data]);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
  };
}
