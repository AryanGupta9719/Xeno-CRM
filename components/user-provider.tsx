"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  avatar: string
} | null

type UserContextType = {
  user: User
  login: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("crm-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem("crm-user")
      }
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("crm-user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("crm-user")
  }

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
