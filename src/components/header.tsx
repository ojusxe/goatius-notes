import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import DarkModeToggle from "./dark-mode-toggle";
import LogoutButton from "./logout-button";

function Header() {
  const user = 1;

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 w-full animate-slide-down">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="flex items-center gap-3 hover-lift group"
        >
          <div className="relative">
            <Image
              src="/gotius.png"
              alt="Gotius Logo"
              width={40}
              height={40}
              className="rounded-full shadow-glow transition-all duration-300 group-hover:shadow-elegant"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-gradient group-hover:scale-105 transition-transform duration-200">
              GOATIUS
            </h1>
            <span className="text-xs text-muted-foreground font-medium -mt-1">
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
              <Button asChild variant="ghost" className="hidden sm:flex hover-lift">
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
