import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist or may have moved.</p>
        </header>

        <div className="auth-actions" style={{ justifyContent: 'center' }}>
          <Link href="/login" className="primary-btn">
            Go to login
          </Link>
        </div>
      </section>
    </main>
  );
}
