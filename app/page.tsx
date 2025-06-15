import { getDb } from '@/db';
import { notes } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = getDb();
  const allNotes = await db.select().from(notes).all();

  async function addNote(formData: FormData) {
    'use server';
    const noteText = formData.get('note') as string;
    if (noteText) {
      const db = getDb();
      await db.insert(notes).values({ text: noteText });
      revalidatePath('/');
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      <form action={addNote} className="mb-4">
        <input
          type="text"
          name="note"
          className="border p-2 mr-2"
          placeholder="Enter a new note"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Note
        </button>
      </form>

      <ul>
        {allNotes.map(note => (
          <li key={note.id} className="border-b p-2">
            {note.text}
          </li>
        ))}
      </ul>
    </main>
  );
}
