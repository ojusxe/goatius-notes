import { getUser } from "@/auth/server";
import { getAllNotesAction } from "@/actions/notes";
import { prisma } from "@/db/prisma";
import NotesApp from "@/components/notes-app";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();
  
  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || "";

  let noteText = "";
  let notes: any[] = [];

  if (user) {
    // Get all notes for sidebar
    const { notes: userNotes } = await getAllNotesAction();
    notes = userNotes || [];

    // Get current note text
    if (noteId) {
      const note = await prisma.note.findUnique({
        where: { id: noteId, authorId: user?.id },
      });
      noteText = note?.text || "";
    }
  }

  return (
    <NotesApp 
      initialNotes={notes} 
      initialUser={user} 
      initialNoteId={noteId}
      initialNoteText={noteText}
    />
  );
}

export default HomePage;
