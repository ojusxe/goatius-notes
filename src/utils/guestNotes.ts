export type GuestNote = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export function getGuestNotes(): GuestNote[] {
  if (typeof window === "undefined") return [];
  try {
    const notes = localStorage.getItem("guest_notes");
    if (!notes) return [];
    return JSON.parse(notes) as GuestNote[];
  } catch {
    return [];
  }
}

export function saveGuestNotes(notes: GuestNote[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("guest_notes", JSON.stringify(notes));
}

export function addGuestNote(note: GuestNote) {
  const notes = getGuestNotes();
  notes.push(note);
  saveGuestNotes(notes);
}

export function updateGuestNote(id: string, text: string) {
  const notes = getGuestNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notes[idx].text = text;
    notes[idx].updatedAt = new Date().toISOString();
    saveGuestNotes(notes);
  }
}

export function deleteGuestNote(id: string) {
  const notes = getGuestNotes().filter((n) => n.id !== id);
  saveGuestNotes(notes);
}
