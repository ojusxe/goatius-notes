import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import DarkModeToggle from "./dark-mode-toggle";
import LogoutButton from "./logout-button";
import { getUser } from "@/auth/server";

async function Header() {
  const user = await getUser();

  return (
    <header className="bg-card/80 border-border/50 animate-slide-down sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <Image
              src="/gotius.png"
              alt="Gotius Logo"
              width={40}
              height={40}
              className="shadow-glow group-hover:shadow-elegant rounded-full transition-all duration-300"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gradient text-xl font-bold tracking-tight">
              GOATIUS
            </h1>
            <span className="text-muted-foreground -mt-1 text-xs font-medium">
              Notes
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="hover-lift hidden sm:flex"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button asChild className="btn-hover hover-lift shadow-glow">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
          <div className="ml-2">
            <DarkModeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
