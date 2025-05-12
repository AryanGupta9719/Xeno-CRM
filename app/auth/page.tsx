"use client"

import { UserProvider } from '@/contexts/UserContext';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome to Xeno CRM
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </UserProvider>
  );
}
