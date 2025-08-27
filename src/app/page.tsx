import { getUser } from "@/auth/server";
import AskAIButton from "@/components/ask-ai-button";
import NewNoteButton from "@/components/new-note-button";
import NoteTextInput from "@/components/note-text-input";

import { prisma } from "@/db/prisma";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();
  let isGuest = false;
  if (typeof window !== "undefined") {
    isGuest = localStorage.getItem("guest_mode") === "true";
  }

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || "";

  let noteText = "";
  if (user) {
    const note = await prisma.note.findUnique({
      where: { id: noteId, authorId: user?.id },
    });
    noteText = note?.text || "";
  } else if (isGuest && typeof window !== "undefined") {
    // @ts-ignore
    const { getGuestNotes } = await import("@/utils/guestNotes");
    const guestNotes = getGuestNotes();
    const guestNote = guestNotes.find((n: any) => n.id === noteId);
    noteText = guestNote?.text || "";
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={noteText} />

      {/* <HomeToast /> */}
    </div>
  );
}

export default HomePage;
