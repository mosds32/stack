import Link from 'next/link';
import type { CSSProperties } from 'react';
import { prisma } from '@/lib/prisma';
import { logoutUser } from '@/app/actions';
import { deleteProject } from '@/app/actions';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const tasks = [
  { title: 'Landing page refresh', meta: 'Design', priority: 'High' },
  { title: 'API schema review', meta: 'Backend', priority: 'Medium' },
  { title: 'Bug triage', meta: 'QA', priority: 'Low' },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { q?: string | string[] };
}) {
  const rawQuery = Array.isArray(searchParams?.q) ? searchParams.q[0] : searchParams?.q ?? '';
  const query = rawQuery.trim();

  const [user, allProjects] = await Promise.all([
    getSessionUser(),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const projects = allProjects.filter((project) => {
    if (!query) return true;
    const searchable = `${project.title} ${project.owner} ${project.description ?? ''} ${project.status}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  const activeProjects = allProjects.filter((project) => !['done', 'complete', 'completed'].includes(project.status.toLowerCase())).length;
  const completedProjects = allProjects.length - activeProjects;
  const completion = allProjects.length ? Math.round((completedProjects / allProjects.length) * 100) : 0;
  const ownerCounts = allProjects.reduce<Record<string, number>>((counts, project) => {
    counts[project.owner] = (counts[project.owner] ?? 0) + 1;
    return counts;
  }, {});
  const topOwners = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxOwnerCount = Math.max(...topOwners.map(([, count]) => count), 1);

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div className="profile-heading">
            <div className="profile-avatar">{(user?.name ?? 'P').slice(0, 1).toUpperCase()}</div>
            <div>
              <h1>{user?.name ?? 'Workspace member'}</h1>
              <p>{user?.email ?? 'Project workspace'} <span className="profile-dot">•</span> Active today</p>
            </div>
          </div>

          <div className="top-actions">
            <Link href="/projects/new" className="primary-btn">
              New project
            </Link>
            <form action={logoutUser}>
              <button type="submit" className="small-btn">
                Logout
              </button>
            </form>
          </div>
        </header>

        <div className="dashboard-toolbar">
          <div>
            <span className="dashboard-eyebrow">Workspace overview</span>
            <h2>Project analytics</h2>
          </div>
          <form action="/dashboard" method="get" className="search-form">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search projects, owners, status..."
              aria-label="Search projects"
            />
            <button type="submit" className="primary-btn small-search-btn">
              Search
            </button>
          </form>
        </div>

        <div className="stat-grid analytics-stat-grid">
          <div className="stat-card">
            <span className="label">Total projects</span>
            <strong>{allProjects.length}</strong>
            <span className="stat-trend">+12% this month</span>
          </div>
          <div className="stat-card">
            <span className="label">Active projects</span>
            <strong>{activeProjects}</strong>
            <span className="stat-trend violet">Current workload</span>
          </div>
          <div className="stat-card">
            <span className="label">Completion</span>
            <strong>{completion}%</strong>
            <span className="stat-trend orange">Based on project status</span>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="card profile-card">
            <div className="card-heading-row"><h3>Project activity</h3><span className="chart-period">Last 30 days</span></div>
            <div className="activity-chart" aria-label="Project activity chart">
              {[42, 56, 48, 72, 62, 82, 70, 92, 76, 86, 66, 96].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
            </div>
            <div className="chart-labels"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>
          </div>

          <div className="card audience-card">
            <div className="card-heading-row"><h3>Project status</h3><span className="chart-period">Overview</span></div>
            <div className="donut-wrap">
              <div className="donut-chart" style={{ '--completion': `${completion}%` } as CSSProperties}><strong>{completion}%</strong><span>Complete</span></div>
              <div className="legend-list"><span><i className="legend-blue" /> Active <b>{activeProjects}</b></span><span><i className="legend-pink" /> Complete <b>{completedProjects}</b></span></div>
            </div>
          </div>

          <div className="card audience-card">
            <div className="card-heading-row"><h3>Projects by owner</h3><span className="chart-period">Top contributors</span></div>
            <div className="horizontal-bars">
              {topOwners.length > 0 ? topOwners.map(([owner, count]) => <div className="bar-row" key={owner}><span>{owner}</span><div><i style={{ width: `${(count / maxOwnerCount) * 100}%` }} /></div><b>{count}</b></div>) : <p className="empty-chart">Create a project to see activity.</p>}
            </div>
          </div>
        </div>

        <div className="board">
          <div className="card project-management-card">
            <div className="card-heading-row"><h3>Recent projects</h3><span className="result-count">{query ? `${projects.length} results` : `${allProjects.length} total`}</span></div>
            <div className="project-list">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-head">
                      <span className="badge success">{project.status}</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="project-meta-row">
                      <h4>{project.title}</h4>
                      <span className="project-owner">{project.owner}</span>
                    </div>
                    <p>{project.description || 'Delivery planning with milestones and stakeholder review.'}</p>

                    <div className="project-actions">
                      <Link href={`/projects/${project.id}/edit`} className="secondary-btn small-btn action-btn">
                        Edit
                      </Link>

                      <form action={deleteProject}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <button type="submit" className="small-btn danger-btn action-btn">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <div className="project-item">
                  <h4>No matching projects</h4>
                  <p>{query ? 'Try another keyword or clear the search.' : 'Create your first project to populate the dashboard.'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3>Upcoming tasks</h3>
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task.title} className="task-item">
                  <div className="task-head">
                    <span className="badge warning">{task.priority}</span>
                    <span>{task.meta}</span>
                  </div>
                  <h4>{task.title}</h4>
                  <p>Team follow-up and product clarity review.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}