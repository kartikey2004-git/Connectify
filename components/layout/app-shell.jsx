/** Centered single-column page frame shared by every route. */
export function AppShell({ children }) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col overflow-x-hidden">
      {children}
    </div>
  );
}
