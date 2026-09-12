import Link from 'next/link';
import { signupUser } from '@/app/actions';

export default function SignupPage() {
  return (
    <main className="auth-page auth-page-reference">
      <section className="auth-card auth-card-reference">
        <div className="auth-welcome-panel">
          <div className="auth-brand">
            <span className="auth-logo" aria-hidden="true"><i /><i /></span>
            <span>PHASE 5</span>
          </div>
          <div className="auth-welcome-copy">
            <p className="auth-kicker">Build together</p>
            <h1>Join the workspace</h1>
            <p>Create your account and start managing projects.</p>
          </div>
          <span className="auth-site">phase5.workspace</span>
        </div>

        <div className="auth-form-panel auth-signup-panel">
          <header className="auth-header auth-header-reference">
            <h2>Create Account</h2>
            <p>Set up your workspace in a few seconds.</p>
          </header>

          <form action={signupUser} className="auth-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" placeholder="Aisha Khan" required />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" placeholder="team@company.com" required />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="At least 6 characters" required />
              </div>
            </div>

            <div className="auth-form-footer auth-signup-footer">
              <span className="auth-form-note">By continuing, you agree to create a workspace account.</span>
              <button type="submit" className="primary-btn auth-submit">
                Create <span aria-hidden="true">›</span>
              </button>
            </div>
          </form>

          <div className="auth-divider"><span>already have an account?</span></div>
          <p className="auth-account-prompt auth-login-prompt"><Link href="/login">Back to Sign In</Link></p>
        </div>
      </section>
    </main>
  );
}
