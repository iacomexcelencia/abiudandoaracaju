import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { TouristPassport } from '@shared/schema';

const PASSPORT_STORAGE_KEY = 'ajudando-aju-passport';

export function usePassport() {
  const [localPassportCode, setLocalPassportCode] = useState<string | null>(null);

  // Load passport code from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setLocalPassportCode(data.passportCode);
      } catch {
        localStorage.removeItem(PASSPORT_STORAGE_KEY);
      }
    }
  }, []);

  // Fetch passport details if code exists
  const { data: passport, isLoading } = useQuery<TouristPassport>({
    queryKey: ['/api/passport', localPassportCode],
    enabled: !!localPassportCode,
  });

  // Create new passport
  const createPassportMutation = useMutation({
    mutationFn: async (email?: string) => {
      const response = await apiRequest('POST', '/api/passport/create', { email });
      const data = await response.json();
      return data as TouristPassport;
    },
    onSuccess: (newPassport) => {
      // Store in localStorage
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify({
        passportCode: newPassport.passportCode,
        createdAt: new Date().toISOString()
      }));
      setLocalPassportCode(newPassport.passportCode);
      queryClient.invalidateQueries({ queryKey: ['/api/passport'] });
    },
  });

  // Recover passport by email
  const recoverPassportMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('GET', `/api/passport/recovery/${email}`);
      const data = await response.json();
      return data as { passportCode: string };
    },
    onSuccess: (data) => {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify({
        passportCode: data.passportCode,
        recoveredAt: new Date().toISOString()
      }));
      setLocalPassportCode(data.passportCode);
      queryClient.invalidateQueries({ queryKey: ['/api/passport'] });
    },
  });

  // Get or create passport (ensures user always has one)
  const getOrCreatePassport = async (email?: string): Promise<TouristPassport> => {
    if (passport) {
      return passport;
    }

    const newPassport = await createPassportMutation.mutateAsync(email);
    return newPassport;
  };

  return {
    passport,
    passportCode: localPassportCode,
    isLoading,
    createPassport: createPassportMutation.mutate,
    recoverPassport: recoverPassportMutation.mutate,
    getOrCreatePassport,
    hasPassport: !!localPassportCode,
  };
}
