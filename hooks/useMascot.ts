import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MascotType, MascotAnimation } from '@/lib/mascotTypes';

export const useMascot = () => {
  const [mascotType, setMascotType] = useState<MascotType>('playful_puppy');
  const [mascotName, setMascotName] = useState('Buddy');
  const [currentAnimation, setCurrentAnimation] = useState<MascotAnimation>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMascotPreference();
  }, []);

  const loadMascotPreference = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('mascot_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setMascotType(data.selected_mascot as MascotType);
        setMascotName(data.mascot_name || 'Buddy');
      }
    } catch (error) {
      console.error('Error loading mascot preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAnimation = useCallback((animation: MascotAnimation) => {
    setCurrentAnimation(animation);
  }, []);

  const resetAnimation = useCallback(() => {
    setCurrentAnimation('idle');
  }, []);

  return {
    mascotType,
    mascotName,
    currentAnimation,
    loading,
    triggerAnimation,
    resetAnimation,
  };
};
