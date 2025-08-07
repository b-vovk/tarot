'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="max-w-sm mx-auto bg-white border rounded p-5">
      <h1 className="text-xl font-semibold mb-4">Увійти / Зареєструватись</h1>
      <button onClick={() => signIn('google')} className="w-full border rounded p-2 mb-4 hover:bg-zinc-50">
        Увійти через Google
      </button>

      <div className="space-y-2">
        <input className="w-full border rounded p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button
          className="w-full border rounded p-2 hover:bg-zinc-50"
          onClick={async () => {
            const res = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
            if (res.ok) alert('Registered. Now sign in.');
            else alert('Registration failed');
          }}
        >
          Зареєструватись
        </button>
        <button onClick={() => signIn('credentials', { email, password })} className="w-full border rounded p-2 hover:bg-zinc-50">
          Увійти (email+password)
        </button>
      </div>
    </div>
  );
}
