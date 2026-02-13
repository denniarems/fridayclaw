import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ChessGame } from '../pages/ChessGame';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}

function ChessComponent() {
  return (
    <ClientOnly>
      <div className="pt-16">
        <ChessGame />
      </div>
    </ClientOnly>
  );
}

export const Route = createFileRoute('/chess')({
  component: ChessComponent,
});
