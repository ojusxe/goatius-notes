'use client';

import React, { useState } from 'react';
import NotesSidebar from '@/components/notes-sidebar';
import { Button } from '@/components/custom';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Note {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  email?: string;
}

interface AppLayoutProps {
  notes: Note[];
  user: User | null;
  currentNoteId?: string;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  notes, 
  user, 
  currentNoteId, 
  children 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <NotesSidebar
        notes={notes}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        currentNoteId={currentNoteId}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-[var(--surface)]/80 border-b border-[var(--border)] backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/icon.png"
                  alt="Goatius Logo"
                  width={40}
                  height={40}
                  className="shadow-glow group-hover:shadow-elegant rounded-full transition-smooth"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-gradient text-xl font-bold tracking-tight font-display">
                  GOATIUS
                </h1>
                <span className="text-[var(--text-tertiary)] -mt-1 text-xs font-medium font-body">
                  Notes
                </span>
              </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {user && (
                <>
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ask AI
                  </Button>
                  <Button variant="ghost" size="sm">
                    {user.email || 'User'}
                  </Button>
                </>
              )}
              {!user && (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
