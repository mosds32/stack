import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

export const SESSION_COOKIE = 'phase5_session';
const AUTH_SECRET = process.env.AUTH_SECRET ?? 'phase5-dev-secret-change-me';
const SECURE_SESSION_COOKIE = process.env.AUTH_COOKIE_SECURE === 'true'
  || (process.env.AUTH_COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production');

export type SessionPayload = {
  sub: number;
  email: string;
  iat: number;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function decodeBase64Url(value: string) {
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function toUint8Array(value: string) {
  return new Uint8Array(Buffer.from(value));
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

  return `pbkdf2_sha512$100000$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const parts = storedHash.split('$');

  if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha512') {
    return false;
  }

  const [, iterations, salt, hash] = parts;
  const candidate = crypto
    .pbkdf2Sync(password, salt, Number(iterations), 64, 'sha512')
    .toString('hex');

  return crypto.timingSafeEqual(
    toUint8Array(candidate),
    toUint8Array(hash),
  );
}

export function signToken(payload: SessionPayload) {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encodeBase64Url(JSON.stringify(payload));
  const signingInput = `${header}.${body}`;
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(signingInput)
    .digest('base64url');

  return `${signingInput}.${signature}`;
}

export function verifyToken(token?: string | null): SessionPayload | null {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(toUint8Array(signature), toUint8Array(expectedSignature))) {
      return null;
    }

    const parsed = JSON.parse(decodeBase64Url(payload)) as SessionPayload;

    if (!parsed.sub || !parsed.email || !parsed.iat) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: payload.sub },
  });
}

export function setSessionCookie(userId: number, email: string) {
  const token = signToken({
    sub: userId,
    email,
    iat: Math.floor(Date.now() / 1000),
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: SECURE_SESSION_COOKIE,
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}
