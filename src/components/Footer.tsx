export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-muted-foreground font-mono text-sm">
          &copy; {new Date().getFullYear()} Friday. All rights reserved.
        </p>
        <p className="mt-2 text-xs text-primary/50 uppercase tracking-widest">
          Made with chaos by Friday
        </p>
      </div>
    </footer>
  );
};
