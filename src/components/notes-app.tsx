'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/custom';
import { FileText, Plus, Save, Menu, X, Sparkles } from 'lucide-react';
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

interface NotesAppProps {
  initialNotes: Note[];
  initialUser: User | null;
  initialNoteId?: string;
  initialNoteText?: string;
}

export default function NotesApp({ 
  initialNotes, 
  initialUser, 
  initialNoteId,
  initialNoteText 
}: NotesAppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentNoteId, setCurrentNoteId] = useState(initialNoteId || '');
  const [noteText, setNoteText] = useState(initialNoteText || '');
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(initialUser);

  // Handle guest mode
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const isGuest = localStorage.getItem('guest_mode') === 'true';
      if (isGuest) {
        // Load guest notes
        const guestNotesStr = localStorage.getItem('guest_notes');
        if (guestNotesStr) {
          const guestNotes = JSON.parse(guestNotesStr);
          setNotes(guestNotes);
        }
      }
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (user) {
        // Save to server
        const response = await fetch('/api/notes/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId: currentNoteId, text: noteText })
        });
        if (response.ok) {
          // Update notes list
          const { notes: updatedNotes } = await (await fetch('/api/notes')).json();
          setNotes(updatedNotes);
        }
      } else {
        // Save to localStorage for guest
        const guestNotes = [...notes];
        const existingNoteIndex = guestNotes.findIndex(n => n.id === currentNoteId);
        if (existingNoteIndex >= 0) {
          guestNotes[existingNoteIndex] = {
            ...guestNotes[existingNoteIndex],
            text: noteText,
            updatedAt: new Date()
          };
        } else if (noteText.trim()) {
          const newNote = {
            id: currentNoteId || `note-${Date.now()}`,
            text: noteText,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          guestNotes.unshift(newNote);
          setCurrentNoteId(newNote.id);
        }
        setNotes(guestNotes);
        localStorage.setItem('guest_notes', JSON.stringify(guestNotes));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewNote = () => {
    setCurrentNoteId('');
    setNoteText('');
  };

  const selectNote = (note: Note) => {
    setCurrentNoteId(note.id);
    setNoteText(note.text);
  };

  const formatNoteTitle = (text: string) => {
    const title = text.split('\n')[0].slice(0, 50);
    return title || 'Untitled Note';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <div 
        className={`border-r transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
        style={{ 
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-display" style={{ color: 'var(--text-primary)' }}>
                Notes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNewNote}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2">
            {notes.length > 0 ? (
              <div className="space-y-1">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`w-full p-3 text-left rounded-lg transition-all hover:bg-opacity-50 ${
                      currentNoteId === note.id 
                        ? 'bg-opacity-100' 
                        : 'hover:bg-opacity-30'
                    }`}
                    style={{
                      backgroundColor: currentNoteId === note.id ? 'var(--primary-highlight)' : 'transparent'
                    }}
                  >
                    <div className="font-medium text-sm mb-1 font-body" style={{ color: 'var(--text-primary)' }}>
                      {formatNoteTitle(note.text)}
                    </div>
                    <div className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(note.updatedAt)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className="h-12 w-12 mb-4" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                  No notes yet. Create your first note to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="border-b backdrop-blur-md" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'var(--border)'
        }}>
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/gotius.png"
                  alt="Gotius Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                    GOATIUS
                  </h1>
                  <span className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
                    Notes
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Ask AI
              </Button>

              {user ? (
                <span className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                  {user.email || 'User'}
                </span>
              ) : (
                <span className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                  Guest Mode
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Note Editor */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="h-full max-w-4xl mx-auto">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Start typing your note here..."
                className="w-full h-full p-6 border rounded-lg resize-none font-body text-base leading-relaxed"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(77, 94, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
