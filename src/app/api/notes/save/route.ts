import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/auth/server';
import { prisma } from '@/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId, text } = await request.json();

    if (!text.trim()) {
      return NextResponse.json({ error: 'Note text cannot be empty' }, { status: 400 });
    }

    let note;
    if (noteId) {
      // Update existing note
      note = await prisma.note.upsert({
        where: { id: noteId },
        update: { text },
        create: {
          id: noteId,
          text,
          authorId: user.id,
        },
      });
    } else {
      // Create new note
      note = await prisma.note.create({
        data: {
          text,
          authorId: user.id,
        },
      });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
