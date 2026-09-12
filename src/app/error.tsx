'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Something went wrong</h1>
          <p>{error.message || 'An unexpected error occurred while loading this page.'}</p>
        </header>

        <div className="auth-actions" style={{ justifyContent: 'center' }}>
          <button type="button" className="primary-btn" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}
