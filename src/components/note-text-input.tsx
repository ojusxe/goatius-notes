"use client";

import { Textarea } from "@/components/custom";
import { ChangeEvent, useState, useEffect } from "react";
import { updateNoteAction } from "@/actions/notes";

type Props = {
  noteId: string;
  startingNoteText: string;
}; 

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
  const [noteText, setNoteText] = useState(startingNoteText);

  // Update when props change (e.g., switching notes)
  useEffect(() => {
    setNoteText(startingNoteText);
  }, [startingNoteText]);

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteText(text);

    // Debounce the save operation
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      if (noteId && noteId.trim() !== "") {
        updateNoteAction(noteId, text);
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Textarea
        value={noteText}
        onChange={handleUpdateNote}
        placeholder="Type your notes here..."
        className="
          h-[calc(100vh-200px)] min-h-[400px] resize-none 
          border-0 text-base leading-relaxed shadow-sm 
          bg-[var(--surface)] text-[var(--text-primary)]
          focus:ring-2 focus:ring-[var(--primary)]
        "
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '16px',
          lineHeight: '1.6'
        }}
      />
    </div>
  );
}

export default NoteTextInput;