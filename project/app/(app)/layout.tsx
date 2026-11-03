'use client'

import { useAuth } from '@/lib/auth-context'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-shell/app-sidebar'
import { AppHeader } from '@/components/app-shell/app-header'
import { Spinner } from '@/components/ui/spinner'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}