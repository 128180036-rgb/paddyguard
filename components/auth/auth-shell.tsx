import Image from 'next/image'
import { Logo } from '@/components/shared/logo'

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <Logo />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
            {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </main>
      </div>
      <aside className="relative hidden overflow-hidden bg-primary lg:block">
        <Image
          src="/images/auth-paddy-field.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <blockquote className="absolute inset-x-10 bottom-10 flex flex-col gap-3 text-primary-foreground">
          <p className="text-balance text-2xl font-medium leading-snug">
            {'“We catch blast weeks earlier now. The robot scouts, the ASIC classifies, and I get an SMS before it spreads.”'}
          </p>
          <footer className="text-sm text-primary-foreground/75">Nimal Perera · Paddy farmer, Polonnaruwa</footer>
        </blockquote>
      </aside>
    </div>
  )
}
