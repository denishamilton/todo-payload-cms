import Link from 'next/link';

// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <Link href="/todos">Todos</Link>
    </div>
  );
}
