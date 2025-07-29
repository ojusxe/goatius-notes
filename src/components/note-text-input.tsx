"use client";

type Props = {
  noteId: string;
  startingNoteText: string;
};
function NoteTextInput({ noteId, startingNoteText }: Props) {
  console.log(noteId);
  return <div>NoteTextInput{startingNoteText}</div>;
}

export default NoteTextInput;
