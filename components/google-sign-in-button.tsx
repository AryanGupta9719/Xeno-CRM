"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface GoogleSignInButtonProps {
  onSignIn: () => Promise<void>
  className?: string
  disabled?: boolean
}

export function GoogleSignInButton({ onSignIn, className = "", disabled = false }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    try {
      await onSignIn()
    } catch (error) {
      console.error("Google sign in failed:", error)
      // Don't rethrow the error, just log it
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={disabled || isLoading}
      className={`
        relative flex items-center justify-center gap-3 
        w-full sm:w-72 px-4 py-2.5 rounded-full shadow-md
        font-medium text-sm
        bg-white text-gray-700 hover:text-gray-900
        dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white
        dark:border dark:border-gray-700
        hover:shadow-lg focus:shadow-lg
        transform hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      aria-label="Sign in with Google"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <GoogleLogo className="h-6 w-6" />
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  )
}

// Google logo as an SVG component for better quality
function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}
