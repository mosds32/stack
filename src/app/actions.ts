'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clearSessionCookie, setSessionCookie, verifyPassword, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function shouldIgnoreRedirectError(error: unknown) {
  return typeof error === 'object' && error !== null && 'digest' in error;
}

export async function loginUser(formData: FormData) {
  try {
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '').trim();

    if (!email || !password) {
      redirect('/login?error=missing');
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      redirect('/login?error=invalid');
    }

    setSessionCookie(user.id, user.email);
    redirect('/dashboard');
  } catch (error) {
    if (shouldIgnoreRedirectError(error)) {
      throw error;
    }
    redirect('/login?error=unknown');
  }
}

export async function signupUser(formData: FormData) {
  try {
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '').trim();

    if (!name || !email || !password) {
      redirect('/signup?error=missing');
    }

    if (password.length < 6) {
      redirect('/signup?error=weak');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      redirect('/signup?error=exists');
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
      },
    });

    setSessionCookie(user.id, user.email);
    redirect('/dashboard');
  } catch (error) {
    if (shouldIgnoreRedirectError(error)) {
      throw error;
    }
    redirect('/signup?error=unknown');
  }
}

export async function logoutUser() {
  try {
    clearSessionCookie();
  } finally {
    redirect('/login');
  }
}

export async function deleteProject(formData: FormData) {
  try {
    const projectId = Number(formData.get('projectId'));

    if (!projectId || Number.isNaN(projectId)) {
      redirect('/dashboard');
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath('/dashboard');
    redirect('/dashboard');
  } catch (error) {
    if (shouldIgnoreRedirectError(error)) {
      throw error;
    }

    redirect('/dashboard?error=delete');
  }
}

export async function updateProject(formData: FormData) {
  try {
    const projectId = Number(formData.get('id'));
    const title = String(formData.get('title') ?? '').trim();
    const owner = String(formData.get('owner') ?? '').trim();
    const status = String(formData.get('status') ?? 'Planning').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!projectId || Number.isNaN(projectId) || !title || !owner) {
      redirect('/dashboard?error=missing');
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        owner,
        status,
        description,
      },
    });

    revalidatePath('/dashboard');
    redirect('/dashboard');
  } catch (error) {
    if (shouldIgnoreRedirectError(error)) {
      throw error;
    }

    redirect('/dashboard?error=update');
  }
}
