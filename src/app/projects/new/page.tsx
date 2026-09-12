import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

async function createProject(formData: FormData) {
  'use server';

  const title = String(formData.get('title') ?? '').trim();
  const owner = String(formData.get('owner') ?? '').trim();
  const status = String(formData.get('status') ?? 'Planning').trim();
  const description = String(formData.get('description') ?? '').trim();

  if (!title || !owner) {
    redirect('/projects/new');
  }

  await prisma.project.create({
    data: {
      title,
      owner,
      status,
      description,
    },
  });

  redirect('/dashboard');
}

export default function NewProjectPage() {
  return (
    <main className="auth-page auth-page-reference project-create-page">
      <section className="auth-card auth-card-reference project-create-card">
        <div className="auth-welcome-panel">
          <div className="auth-brand">
            <span className="auth-logo" aria-hidden="true"><i /><i /></span>
            <span>PHASE 5</span>
          </div>
          <div className="auth-welcome-copy">
            <p className="auth-kicker">Your workspace</p>
            <h1>Build something great</h1>
            <p>Turn your next idea into a clear, trackable project.</p>
          </div>
          <span className="auth-site">phase5.workspace</span>
        </div>

        <div className="auth-form-panel project-form-panel">
          <header className="auth-header auth-header-reference">
            <h2>Create Project</h2>
            <p>Add a project to your workspace dashboard.</p>
          </header>

          <form action={createProject} className="auth-form project-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="title">Project Name</label>
                <input id="title" name="title" type="text" placeholder="Client portal refresh" required />
              </div>

              <div className="input-group">
                <label htmlFor="owner">Project Owner</label>
                <input id="owner" name="owner" type="text" placeholder="Aisha Khan" required />
              </div>

              <div className="input-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue="Planning">
                  <option>Planning</option>
                  <option>In progress</option>
                  <option>Review</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" placeholder="Describe the project goals and scope..." />
              </div>
            </div>

            <div className="auth-form-footer project-form-footer">
              <Link href="/dashboard" className="project-back-link">Back to dashboard</Link>
              <button type="submit" className="primary-btn auth-submit">
                Create <span aria-hidden="true">›</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
