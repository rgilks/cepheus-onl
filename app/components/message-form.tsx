'use client';

import { useSound } from '@/lib/hooks';
import { useState } from 'react';

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const playClickSound = useSound('/mp3/beep_button.mp3');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    await fetch('/api/discord/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Enter a message to send to Discord"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Send Message
      </button>
    </form>
  );
}
