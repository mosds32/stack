import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { updateProject } from '@/app/actions';

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const projectId = Number(params.id);

  if (!projectId || Number.isNaN(projectId)) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="form-page">
      <section className="form-shell">
        <header className="form-header">
          <div>
            <h1>Edit project</h1>
            <p>Update the project details and save the changes.</p>
          </div>

          <Link href="/dashboard" className="small-btn">
            Back to dashboard
          </Link>
        </header>

        <div className="form-card">
          <form action={updateProject}>
            <input type="hidden" name="id" value={project.id} />

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="title">Project name</label>
                <input id="title" name="title" type="text" defaultValue={project.title} required />
              </div>

              <div className="input-group">
                <label htmlFor="owner">Project owner</label>
                <input id="owner" name="owner" type="text" defaultValue={project.owner} required />
              </div>

              <div className="input-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={project.status}>
                  <option>Planning</option>
                  <option>In progress</option>
                  <option>Review</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" defaultValue={project.description ?? ''} />
              </div>
            </div>

            <div className="form-actions">
              <Link href="/dashboard" className="secondary-btn">
                Cancel
              </Link>
              <button type="submit" className="form-btn">
                Update project
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
