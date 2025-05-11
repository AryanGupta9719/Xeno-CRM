"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Send, History, Bell, Bot, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/components/user-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  setOpen?: (open: boolean) => void
}

export function Sidebar({ className, open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobile, open])

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Segments", href: "/segments", icon: Users },
    { name: "Create Campaign", href: "/campaigns/create", icon: Send },
    { name: "Campaign History", href: "/campaigns/history", icon: History },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  ]

  if (!user) {
    return null
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent" : "transparent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className={cn("pb-12", className)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent" : "transparent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
