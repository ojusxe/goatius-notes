import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Plus, FileText, Sparkles } from 'lucide-react';

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

interface SimpleAppLayoutProps {
  notes: Note[];
  user: User | null;
  currentNoteId?: string;
  children: React.ReactNode;
}

function SimpleAppLayout({ notes, user, currentNoteId, children }: SimpleAppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <div 
        className="w-64 h-full border-r flex flex-col"
        style={{ 
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)'
        }}
      >
        {/* Sidebar Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 
            className="text-lg font-semibold"
            style={{ 
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-inter)'
            }}
          >
            Notes
          </h2>
        </div>

        {/* New Note Button */}
        <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="block">
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'var(--text-inverse)',
                fontFamily: 'var(--font-inter)'
              }}
            >
              <Plus size={16} />
              New Note
            </button>
          </Link>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2">
          {notes.length > 0 ? (
            <div className="space-y-1">
              {notes.map((note) => (
                <Link key={note.id} href={`/?noteId=${note.id}`}>
                  <div 
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentNoteId === note.id 
                        ? 'ring-2 ring-blue-500' 
                        : 'hover:bg-opacity-50'
                    }`}
                    style={{ 
                      backgroundColor: currentNoteId === note.id 
                        ? 'var(--primary)' 
                        : 'transparent',
                      color: currentNoteId === note.id 
                        ? 'var(--text-inverse)' 
                        : 'var(--text-primary)',
                      fontFamily: 'var(--font-inter)'
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <FileText size={16} className="mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {note.text.slice(0, 50) || 'Untitled Note'}
                        </p>
                        <p 
                          className="text-xs mt-1 opacity-70"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <FileText size={48} style={{ color: 'var(--text-tertiary)' }} className="mb-4" />
              <p 
                className="text-sm"
                style={{ 
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-inter)'
                }}
              >
                No notes yet. Create your first note to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header 
          className="border-b backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(var(--surface-rgb), 0.8)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex h-16 items-center justify-between px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/gotius.png"
                  alt="Gotius Logo"
                  width={40}
                  height={40}
                  className="rounded-full transition-all duration-300"
                  style={{ 
                    boxShadow: '0 0 20px rgba(77, 94, 255, 0.3)'
                  }}
                />
              </div>
              <div className="flex flex-col">
                <h1 
                  className="text-xl font-bold tracking-tight"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-alt) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--font-inter)'
                  }}
                >
                  GOATIUS
                </h1>
                <span 
                  className="text-xs font-medium -mt-1"
                  style={{ 
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-inter)'
                  }}
                >
                  Notes
                </span>
              </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {user && (
                <>
                  <button 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border)',
                      fontFamily: 'var(--font-inter)'
                    }}
                  >
                    <Sparkles size={16} />
                    Ask AI
                  </button>
                  <span 
                    className="text-sm"
                    style={{ 
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-inter)'
                    }}
                  >
                    {user.email || 'User'}
                  </span>
                </>
              )}
              {!user && (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <button 
                      className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200"
                      style={{ 
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border)',
                        fontFamily: 'var(--font-inter)'
                      }}
                    >
                      Login
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button 
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--text-inverse)',
                        fontFamily: 'var(--font-inter)'
                      }}
                    >
                      Sign Up
                    </button>
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
}

export default SimpleAppLayout;
