'use client';

export function GlobalBackground() {
  return (
    <div
      className="fixed inset-0 bg-black"
      style={{
        zIndex: -100,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    />
  );
}
