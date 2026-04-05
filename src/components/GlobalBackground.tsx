'use client';

export function GlobalBackground() {
  return (
    <div 
      className="fixed inset-0 -z-50"
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(59, 130, 246, 0.05) 30%, rgba(0, 0, 0, 1) 70%)`,
      }}
    />
  );
}
