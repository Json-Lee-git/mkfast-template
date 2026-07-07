import { m } from '@/locale/paraglide/messages';
import { getNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { authClient } from '@/auth/client';
import { isLinkActive } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Routes } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Container from '@/components/layout/container';
import { Logo } from '@/components/shared/logo';
import { ModeSwitcher } from '@/components/theme/mode-switcher';
import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { UserButton } from '@/components/shared/user-button';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { IconArrowRight } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { websiteConfig } from '@/config/website';

interface NavbarProps {
  scroll?: boolean;
}

export function Navbar({ scroll = true }: NavbarProps) {
  const pathname = useLocation().pathname;
  const scrolled = useScroll(50);
  const menuLinks = getNavbarLinks();
  const [mounted, setMounted] = useState(false);
  const [menuValue, setMenuValue] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const showBarBg = scroll && scrolled;

  useEffect(() => {
    setMounted(true);
    setMenuValue(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky inset-x-0 top-0 z-40 border-b border-border/60 bg-background/90 py-3 backdrop-blur-md transition-all duration-300',
        showBarBg && 'shadow-sm'
      )}
    >
      <div className="relative z-10">
        <Container className="px-4">
          <nav
            aria-label={m.common_main_navigation()}
            className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4"
          >
            <Link
              to="/"
              aria-label={m.common_home()}
              className="flex items-center gap-2 shrink-0"
            >
              <Logo />
              <span className="text-lg font-semibold tracking-tight">
                {websiteConfig.metadata?.name}
              </span>
            </Link>

            <NavigationMenu
              value={menuValue}
              onValueChange={setMenuValue}
              className="flex-1 justify-center"
            >
              <NavigationMenuList aria-orientation={undefined}>
                {menuLinks?.map((item) =>
                  item.items ? (
                    <NavigationMenuItem key={item.title} value={item.title}>
                      <NavigationMenuTrigger
                        className={cn(
                          'bg-transparent text-sm',
                          item.items.some((group) =>
                            group.items?.some((sub) =>
                              isLinkActive(sub.href, pathname)
                            )
                          ) && 'font-semibold text-foreground'
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex max-w-[min(920px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border/70 bg-background shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
                          <div className="grid w-[660px] grid-cols-3 gap-3 p-4">
                            {item.items.map((group) => (
                              <div key={group.title}>
                                <h4 className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  {group.title}
                                </h4>
                                <ul className="space-y-0.5">
                                  {group.items?.map((sub) => (
                                    <li key={sub.title}>
                                      <NavigationMenuLink
                                        closeOnClick
                                        className={cn(
                                          'group flex min-h-16 select-none flex-col items-start rounded-lg px-3 py-2.5 leading-none no-underline outline-hidden transition-colors',
                                          'hover:bg-muted/80 hover:text-foreground',
                                          'focus:bg-accent focus:text-accent-foreground',
                                          isLinkActive(sub.href, pathname) &&
                                            'bg-muted text-foreground'
                                        )}
                                        render={
                                          <Link
                                            to={sub.href ?? '#'}
                                            target={
                                              sub.external
                                                ? '_blank'
                                                : undefined
                                            }
                                            rel={
                                              sub.external
                                                ? 'noopener noreferrer'
                                                : undefined
                                            }
                                          />
                                        }
                                      >
                                        <span className="text-sm font-medium">
                                          {sub.title}
                                        </span>
                                        {sub.description ? (
                                          <span className="mt-1.5 text-xs leading-snug text-muted-foreground">
                                            {sub.description}
                                          </span>
                                        ) : null}
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <div className="hidden w-[250px] shrink-0 border-l bg-stone-50 p-5 dark:bg-zinc-950 xl:flex xl:flex-col xl:justify-between">
                            <div>
                              <div className="mb-4 rounded-lg border border-border/70 bg-background p-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <span className="h-2 w-14 rounded-full bg-blue-500" />
                                  <span className="text-xs font-semibold text-foreground">
                                    64/100
                                  </span>
                                </div>
                                <div className="mt-3 space-y-2">
                                  <span className="block h-2 w-full rounded-full bg-muted" />
                                  <span className="block h-2 w-4/5 rounded-full bg-muted" />
                                  <span className="block h-2 w-2/3 rounded-full bg-muted" />
                                </div>
                              </div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Sample Fix Pack
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                See what a $19 repair plan looks like before you
                                commit. Copy-ready schema, LLMs.txt guidance,
                                and prioritized fixes.
                              </p>
                            </div>
                            <Link
                              to="/sample-aeo-report"
                              className="mt-5 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-gray-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                            >
                              Preview Fix Pack
                              <IconArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink
                        render={<Link to={item.href ?? '#'} />}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'bg-transparent text-sm',
                          isLinkActive(item.href, pathname) &&
                            'font-semibold text-primary'
                        )}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4 shrink-0">
              <LocaleSwitcher />
              <ModeSwitcher />
              {websiteConfig.auth?.enable &&
                (!mounted || isPending ? (
                  <Skeleton className="size-8 rounded-full" />
                ) : user ? (
                  <UserButton user={user} />
                ) : (
                  <>
                    <LoginWrapper mode="modal" asChild>
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                          }),
                          'cursor-pointer'
                        )}
                      >
                        {m.auth_common_login()}
                      </button>
                    </LoginWrapper>
                    <Link
                      to={Routes.Register}
                      className={buttonVariants({ size: 'sm' })}
                    >
                      {m.auth_common_signup()}
                    </Link>
                  </>
                ))}
            </div>
          </nav>

          <NavbarMobile className="lg:hidden" />
        </Container>
      </div>
    </header>
  );
}
