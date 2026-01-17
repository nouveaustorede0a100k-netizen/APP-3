import { useState, useEffect } from 'react';
import { getAnimationById } from '@/constants/animations';

export function useAnimation(animationId: number | null) {
  const [animation, setAnimation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animationId) {
      setAnimation(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const animData = getAnimationById(animationId);
      
      if (animData) {
        // Try to load Lottie file (will use placeholder if not found)
        try {
          const source = require(`@/assets/animations/${animData.asset_name}.json`);
          setAnimation({ ...animData, source });
        } catch {
          // Use placeholder
          const placeholder = require('@/assets/animations/placeholder.json');
          setAnimation({ ...animData, source: placeholder });
        }
      } else {
        setError('Animation not found');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [animationId]);

  return { animation, loading, error };
}
