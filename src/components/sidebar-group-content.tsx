"use client";

import { Note } from "@prisma/client";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  return <div></div>;
}

export default SidebarGroupContent;
