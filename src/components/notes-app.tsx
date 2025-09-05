'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/custom';
import { FileText, Plus, Save, Menu, X, Sparkles, Trash2, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import MarkdownEditor from '@/components/markdown-editor';
import { saveNoteOffline, isOnline, addNetworkListeners } from '@/lib/pwa';

interface Note {
  id: string;
  title: string;
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
  initialNoteTitle?: string;
}

export default function NotesApp({ 
  initialNotes, 
  initialUser, 
  initialNoteId,
  initialNoteText,
  initialNoteTitle
}: NotesAppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentNoteId, setCurrentNoteId] = useState(initialNoteId || '');
  const [noteText, setNoteText] = useState(initialNoteText || '');
  const [noteTitle, setNoteTitle] = useState(initialNoteTitle || '');
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [isOffline, setIsOffline] = useState(false);

  // Handle guest mode and offline functionality
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

    // Set initial online status
    setIsOffline(!isOnline());

    // Add network listeners
    const removeListeners = addNetworkListeners(
      () => {
        setIsOffline(false);
        console.log('Notes app is online');
      },
      () => {
        setIsOffline(true);
        console.log('Notes app is offline');
      }
    );

    return removeListeners;
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (user && !isOffline) {
        // Save to server when online
        const response = await fetch('/api/notes/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId: currentNoteId, text: noteText, title: noteTitle })
        });
        if (response.ok) {
          // Update notes list
          const { notes: updatedNotes } = await (await fetch('/api/notes')).json();
          setNotes(updatedNotes);
        }
      } else if (user && isOffline) {
        // Save offline for authenticated users
        const noteData = {
          id: currentNoteId,
          title: noteTitle,
          text: noteText,
          updatedAt: new Date().toISOString()
        };
        saveNoteOffline(noteData);
        
        // Update local notes list
        const updatedNotes = notes.map(note => 
          note.id === currentNoteId 
            ? { ...note, title: noteTitle, text: noteText, updatedAt: new Date() }
            : note
        );
        setNotes(updatedNotes);
      } else {
        // Save to localStorage for guest
        const guestNotes = [...notes];
        const existingNoteIndex = guestNotes.findIndex(n => n.id === currentNoteId);
        if (existingNoteIndex >= 0) {
          guestNotes[existingNoteIndex] = {
            ...guestNotes[existingNoteIndex],
            title: noteTitle,
            text: noteText,
            updatedAt: new Date()
          };
        } else if (noteText.trim() || noteTitle.trim()) {
          const newNote = {
            id: currentNoteId || `note-${Date.now()}`,
            title: noteTitle,
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
    setNoteTitle('');
  };

  const selectNote = (note: Note) => {
    setCurrentNoteId(note.id);
    setNoteText(note.text);
    setNoteTitle(note.title || '');
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent note selection when clicking delete
    
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      if (user) {
        // Delete from server
        const response = await fetch(`/api/notes/${noteId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Update notes list
          const { notes: updatedNotes } = await (await fetch('/api/notes')).json();
          setNotes(updatedNotes);
          
          // If we deleted the current note, clear the editor
          if (noteId === currentNoteId) {
            setCurrentNoteId('');
            setNoteText('');
            setNoteTitle('');
          }
        }
      } else {
        // Delete from localStorage for guest
        const guestNotes = notes.filter(n => n.id !== noteId);
        setNotes(guestNotes);
        localStorage.setItem('guest_notes', JSON.stringify(guestNotes));
        
        // If we deleted the current note, clear the editor
        if (noteId === currentNoteId) {
          setCurrentNoteId('');
          setNoteText('');
          setNoteTitle('');
        }
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const formatNoteTitle = (note: Note) => {
    if (note.title && note.title.trim()) {
      return note.title.slice(0, 50);
    }
    const textTitle = note.text.split('\n')[0].slice(0, 50);
    return textTitle || 'Untitled Note';
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
          sidebarOpen ? 'w-64 md:w-64' : 'w-0'
        } ${sidebarOpen ? 'fixed md:relative' : ''} ${sidebarOpen ? 'z-20 md:z-auto' : ''} ${sidebarOpen ? 'h-full md:h-auto' : ''} overflow-hidden`}
        style={{ 
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold font-display" style={{ color: 'var(--text-primary)' }}>
                  Notes
                </h2>
                {isOffline ? (
                  <WifiOff className="h-4 w-4 text-orange-500" title="Offline" />
                ) : (
                  <Wifi className="h-4 w-4 text-green-500" title="Online" />
                )}
              </div>
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
                  <div
                    key={note.id}
                    className={`relative group rounded-lg transition-all ${
                      currentNoteId === note.id 
                        ? 'bg-opacity-100' 
                        : 'hover:bg-opacity-30'
                    }`}
                    style={{
                      backgroundColor: currentNoteId === note.id ? 'var(--primary-highlight)' : 'transparent'
                    }}
                  >
                    <button
                      onClick={() => selectNote(note)}
                      className="w-full p-3 text-left rounded-lg transition-all"
                    >
                      <div className="font-medium text-sm mb-1 font-body pr-8" style={{ color: 'var(--text-primary)' }}>
                        {formatNoteTitle(note)}
                      </div>
                      <div className="text-xs font-body" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDate(note.updatedAt)}
                      </div>
                    </button>
                    
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                      title="Delete note"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
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
        {/* Menu button for collapsed sidebar */}
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white shadow-md border border-gray-200"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Note Editor */}
        <main className="flex-1 overflow-hidden relative">
          <div className="h-full p-6 pb-20 md:pb-6">
            <MarkdownEditor 
              noteId={currentNoteId}
              startingNoteText={noteText}
              startingNoteTitle={noteTitle}
              onTextChange={setNoteText}
              onTitleChange={setNoteTitle}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
          
          {/* Bottom Right Logo and User Info */}
          <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-body text-gray-700">
                    {user.email || 'User'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-body text-gray-700">Guest Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href="/login" 
                      className="text-xs text-[var(--primary)] hover:text-[var(--primary-alt)] font-medium"
                    >
                      Login
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link 
                      href="/signup" 
                      className="text-xs text-[var(--primary)] hover:text-[var(--primary-alt)] font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-l border-gray-200 pl-3">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="Goatius Logo"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
                <div className="text-xs">
                  <div className="font-bold font-display text-gray-900">GOATIUS</div>
                  <div className="font-body text-gray-500">Notes</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Bottom Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-body text-gray-700 text-xs">
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-body text-gray-700 text-xs">Guest</span>
                </div>
              )}
            </div>
            
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Goatius Logo"
                width={20}
                height={20}
                className="rounded-lg"
              />
              <div className="text-xs">
                <div className="font-bold font-display text-gray-900">GOATIUS</div>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
