import Link from "next/link";
import React from "react";
import Image from "next/image";
import { shadow } from "@/app/styles/utils";
import { Button } from "./ui/button";
import DarkModeToggle from "./dark-mode-toggle";
import LogoutButton from "./logout-button";

function Header() {
  const user = 1;

  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/gotius.png"
          alt="Gotius Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
        <h1 className="flex flex-col pb-1 text-2xl leading-6 font-semibold">
          GOATIUS <span>Notes</span>
        </h1>
      </Link>
      <div className="flex gap-4">
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
