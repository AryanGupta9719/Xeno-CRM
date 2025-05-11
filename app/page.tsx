"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { GoogleSignInButton } from "@/components/google-sign-in-button"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [signInStatus, setSignInStatus] = useState<string | null>(null)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Simulate successful login
      if (Math.random() > 0.2) {
        router.push("/dashboard")
      } else {
        // Simulate login error
        setIsLoading(false)
        toast({
          title: "Authentication failed",
          description: "Unable to sign in with Google. Please try again.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleGoogleSignIn = async () => {
    try {
      // Simulate OAuth flow with a delay
      return new Promise<void>((resolve) => {
        setIsLoading(true)
        setTimeout(() => {
          // Always succeed for demo purposes
          setSignInStatus("Successfully signed in with Google!")
          // Add a small delay before redirecting to show the success message
          setTimeout(() => {
            router.push("/dashboard")
          }, 500)
          resolve()
        }, 1500)
      })
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Theme toggle button */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm z-10 transition-colors hover:bg-white/20 dark:hover:bg-gray-800/80"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
        </button>
      )}

      {/* Brand section (left side on desktop) */}
      <motion.div
        className="w-full md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900 p-8 md:p-12 flex items-center justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <Image src="/crm-logo.png" alt="Xeno CRM Logo" width={80} height={80} className="mb-6" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Xeno CRM
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Engage Smarter, Sell Better
          </motion.p>

          <motion.div
            className="mt-12 space-y-4 text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <p className="flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-white/90 mr-3"></span>
              Streamline customer relationships
            </p>
            <p className="flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-white/90 mr-3"></span>
              Boost team productivity
            </p>
            <p className="flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-white/90 mr-3"></span>
              Data-driven insights
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Login section (right side on desktop) */}
      <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10" variants={itemVariants}>
            <motion.h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2" variants={itemVariants}>
              Welcome back
            </motion.h2>

            <motion.p className="text-gray-600 dark:text-gray-300 mb-8" variants={itemVariants}>
              Sign in to your account to continue
            </motion.p>

            <motion.div variants={itemVariants}>
              <GoogleSignInButton onSignIn={handleGoogleSignIn} />
              {signInStatus && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm">
                  {signInStatus}
                </div>
              )}
            </motion.div>

            <motion.div className="mt-6 flex items-center justify-center" variants={itemVariants}>
              <div className="h-px bg-gray-300 dark:bg-gray-600 w-full"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-2">or</p>
              <div className="h-px bg-gray-300 dark:bg-gray-600 w-full"></div>
            </motion.div>

            <motion.div className="mt-6" variants={itemVariants}>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                Continue as guest
              </Button>
            </motion.div>
          </motion.div>

          <motion.p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8" variants={itemVariants}>
            By signing in, you agree to our{" "}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
