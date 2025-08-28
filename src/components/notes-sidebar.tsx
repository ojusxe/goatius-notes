import React from 'react';
import { Button } from '@/components/custom';
import { ChevronLeft, ChevronRight, Plus, FileText } from 'lucide-react';
import Link from 'next/link';

interface Note {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesSidebarProps {
  notes: Note[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentNoteId?: string;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ 
  notes, 
  isCollapsed, 
  onToggleCollapse,
  currentNoteId 
}) => {
  return (
    <div 
      className={`
        h-full bg-[var(--surface-elevated)] border-r border-[var(--border)]
        transition-all duration-300 ease-[var(--transition-smooth)]
        ${isCollapsed ? 'w-12' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-[var(--text-primary)] font-display">
            Notes
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex flex-col h-full">
          {/* New Note Button */}
          <div className="p-3 border-b border-[var(--border)]">
            <Link href="/">
              <Button variant="primary" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </Link>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {notes.length > 0 ? (
              <div className="p-2 space-y-1">
                {notes.map((note) => (
                  <Link key={note.id} href={`/?noteId=${note.id}`}>
                    <div 
                      className={`
                        p-3 rounded-lg cursor-pointer transition-smooth
                        ${currentNoteId === note.id 
                          ? 'bg-[var(--primary)] text-[var(--text-inverse)]' 
                          : 'hover:bg-[var(--surface-elevated)] text-[var(--text-primary)]'
                        }
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {note.text.slice(0, 50) || 'Untitled Note'}
                          </p>
                          <p className={`text-xs mt-1 ${
                            currentNoteId === note.id 
                              ? 'text-[var(--text-inverse)]/70' 
                              : 'text-[var(--text-tertiary)]'
                          }`}>
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
                <FileText className="h-12 w-12 text-[var(--text-tertiary)] mb-4" />
                <p className="text-[var(--text-secondary)] font-body text-sm">
                  No notes yet. Create your first note to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed state */}
      {isCollapsed && (
        <div className="flex flex-col items-center py-4 space-y-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <div className="w-6 h-px bg-[var(--border)]" />
          {notes.slice(0, 5).map((note) => (
            <Link key={note.id} href={`/?noteId=${note.id}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-2 h-8 w-8 ${
                  currentNoteId === note.id ? 'bg-[var(--primary)] text-[var(--text-inverse)]' : ''
                }`}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesSidebar;