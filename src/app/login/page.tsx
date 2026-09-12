import Link from 'next/link';
import { loginUser } from '@/app/actions';

export default function LoginPage() {
  return (
    <main className="auth-page auth-page-reference">
      <section className="auth-card auth-card-reference">
        <div className="auth-welcome-panel">
          <div className="auth-brand">
            <span className="auth-logo" aria-hidden="true"><i /><i /></span>
            <span>PHASE 5</span>
          </div>
          <div className="auth-welcome-copy">
            <p className="auth-kicker">Your workspace</p>
            <h1>Welcome Page</h1>
            <p>Sign in to continue access</p>
          </div>
          <span className="auth-site">phase5.workspace</span>
        </div>

        <div className="auth-form-panel">
          <header className="auth-header auth-header-reference">
            <h2>Sign In</h2>
            <p>Use your account details to continue.</p>
          </header>

          <form action={loginUser} className="auth-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" placeholder="admin@phase5.com" required />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="Enter your password" required />
              </div>
            </div>

            <div className="auth-form-footer">
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="submit" className="primary-btn auth-submit">
                Continue <span aria-hidden="true">›</span>
              </button>
            </div>
          </form>

          <div className="auth-divider"><span>or connect with social media</span></div>
          <div className="social-actions" aria-label="Social sign in options">
            <button type="button" className="social-btn social-twitter" disabled><strong>t</strong> Sign in with Twitter</button>
            <button type="button" className="social-btn social-facebook" disabled><strong>f</strong> Sign in with Facebook</button>
          </div>

          <p className="auth-account-prompt">Need an account? <Link href="/signup">Sign up</Link></p>
          <p className="auth-demo">Demo: admin@phase5.com / password123</p>
        </div>
      </section>
    </main>
  );
}
