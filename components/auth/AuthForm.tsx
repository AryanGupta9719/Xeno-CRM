'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

export default function AuthForm() {
  const router = useRouter();
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      login({
        id: "1",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/diverse-avatars.png",
      });
      
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <Button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg shadow-sm transition-all duration-300"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        ) : (
          <>
            <Image src="/google-logo.png" alt="Google" width={24} height={24} className="rounded-full" />
            <span>Sign in with Google</span>
          </>
        )}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
} 