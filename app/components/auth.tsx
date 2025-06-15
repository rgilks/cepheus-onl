'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Auth() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn('discord')} className="bg-blue-500 text-white p-2 rounded">
      Sign in with Discord
    </button>
  );
}
