"use client";

import { Button } from "@/components/ui/button";
import useScroll from "@/hooks/use-scroll";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { MainNavItem } from "@/types";

import { MainNav } from "@/components/layout/main-nav";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { Icons } from "@/components/shared/icons";
import { AllAuthConfigs } from "@/config/auth";
import { useSession } from "next-auth/react";

interface NavBarProps {
  lang: string;
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
}

export function NavBar({
  lang,
  items,
  children,
  rightElements,
  scroll = false,
}: NavBarProps) {
  const scrolled = useScroll(50);
  const signInModal = useSigninModal();
  // console.log('Navbar, scrolled', scrolled, ', lang:', lang);
  const authConfig = AllAuthConfigs[lang];
  const { data: session, status } = useSession();

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${scroll ? (scrolled ? "border-b" : "bg-background/0") : "border-b"}`}
    >
      <div className="container flex h-[72px] items-center justify-between py-4">
        <MainNav lang={lang} items={items}>{children}</MainNav>

        <div className="flex items-center space-x-2">
          {rightElements}

          {session ? (
            <UserAccountNav lang={lang} />
          ) : status === "unauthenticated" ? (
            <Button
              className="gap-2 px-4"
              variant="default"
              size="sm"
              rounded="full"
              onClick={signInModal.onOpen}
            >
              <span>
                {authConfig.signin}
              </span>
              <Icons.arrowRight className="size-4" />
            </Button>
          ) : null}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
