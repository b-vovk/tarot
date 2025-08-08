'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const p = usePathname();
  const LinkItem = ({href, children}:{href:string, children:React.ReactNode}) => (
    <Link className={`px-2 py-1 rounded ${p===href?'bg-zinc-900 text-white':'hover:bg-zinc-200'}`} href={href}>{children}</Link>
  );
  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto p-3 flex items-center gap-3">
        <Link href="/" className="font-semibold">Tarot Daily</Link>
        <nav className="ml-auto flex items-center gap-2 text-sm">
          <LinkItem href="/">Головна</LinkItem>
          <LinkItem href="/login">Увійти</LinkItem>
        </nav>
      </div>
    </header>
  );
}
