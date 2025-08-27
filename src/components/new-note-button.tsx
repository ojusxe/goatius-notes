"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "@/actions/notes";

type Props = {
  user: User | null;
};

function NewNoteButton({ user }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleClickNewNoteButton = async () => {
    const isGuest = typeof window !== "undefined" && localStorage.getItem("guest_mode") === "true";
    if (!user && !isGuest) {
      router.push("/login");
    } else if (isGuest) {
      setLoading(true);
      const uuid = uuidv4();
      const now = new Date().toISOString();
      const note = { id: uuid, text: "", createdAt: now, updatedAt: now };
      // @ts-ignore
      import("@/utils/guestNotes").then(({ addGuestNote }) => {
        addGuestNote(note);
        router.push(`/?noteId=${uuid}&toastType=newNote`);
        setLoading(false);
      });
    } else {
      setLoading(true);
      const uuid = uuidv4();
      await createNoteAction(uuid);
      router.push(`/?noteId=${uuid}&toastType=newNote`);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
}

export default NewNoteButton;