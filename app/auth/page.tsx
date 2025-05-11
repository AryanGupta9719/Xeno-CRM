"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useUser } from "@/components/user-provider"

export default function AuthPage() {
  const router = useRouter()
  const { login } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setTimeout(() => {
      login({
        id: "1",
        name: "Jane Smith",
        email: "ag51532srmist..edu.in",
        avatar: "/diverse-avatars.png",
      })
      router.push("/")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mini CRM</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your account</p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
            ) : (
              <>
                <Image src="/google-logo.png" alt="Google" width={24} height={24} className="rounded-full" />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
