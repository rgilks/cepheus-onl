'use client';

import { useSound } from '@/lib/hooks';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendDiscordMessage, type FormState } from '../lib/discord/actions';
import { useEffect, useRef } from 'react';

const initialState: FormState = {
  message: '',
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="bg-blue-500 text-white p-2 rounded" aria-disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export default function MessageForm() {
  const [state, formAction] = useActionState(sendDiscordMessage, initialState);
  const playClickSound = useSound('/mp3/beep_electric_3.mp3', 0.5);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'Message sent successfully.') {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} onSubmit={() => playClickSound()} className="mt-4">
      <input
        type="text"
        name="message"
        className="border p-2 mr-2"
        placeholder="Enter a message to send to Discord"
        required
      />
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
      {state.errors?.message &&
        state.errors.message.map((error: string) => (
          <p className="text-sm font-medium text-red-500" key={error}>
            {error}
          </p>
        ))}
    </form>
  );
}
