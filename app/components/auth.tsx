'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useSound } from '@/lib/hooks';

const Auth = () => {
  const { data: session } = useSession();
  const playClickSound = useSound('/mp3/beep_electric_2.mp3', 0.5);

  const handleSignOut = () => {
    playClickSound();
    signOut();
  };

  const handleSignIn = () => {
    playClickSound();
    signIn('discord');
  };

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.email}</p>
        <button onClick={handleSignOut} className="bg-red-500 text-white p-2 rounded">
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button onClick={handleSignIn} className="bg-blue-500 text-white p-2 rounded">
      Sign in with Discord
    </button>
  );
};

export default Auth;
