'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ModeBadge } from '@/components/shared/status-badge'
import { ALL_NAV_ITEMS } from '@/lib/nav'
import { SYSTEM_MODE, summary } from '@/lib/demo-data'

export function AppHeader() {
  const pathname = usePathname()
  const current = ALL_NAV_ITEMS.find((i) => pathname.startsWith(i.href))

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 h-5 data-vertical:self-center" />
      <span className="truncate text-sm font-medium">{current?.title ?? 'Dashboard'}</span>

      <div className="ml-auto flex items-center gap-2">
        <InputGroup className="hidden w-64 md:flex lg:w-80">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search images, jobs, robots…" aria-label="Search" />
        </InputGroup>
        <ModeBadge mode={SYSTEM_MODE} className="hidden sm:inline-flex" />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          render={<Link href="/notifications" aria-label={`Notifications, ${summary.activeAlerts} unread`} />}
          nativeButton={false}
        >
          <Bell />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" aria-hidden="true" />
        </Button>
      </div>
    </header>
  )
}
