'use server';

import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function subscribeUser(sub: PushSubscription) {
  const cookieStore = await cookies();
  const response = await fetch(`${API_BASE}/notifications/push/subscribe`, {
    method: 'POST',
    body: JSON.stringify(sub),
    headers: {
      Cookie: cookieStore.toString(),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to subscribe');
  }
  return { success: true };
}

export async function unsubscribeUser(endpoint?: string) {
  await fetch(`${API_BASE}/notifications/push/unsubscribe`, {
    method: 'DELETE',
    body: JSON.stringify({ endpoint }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return { success: true };
}

export async function sendNotification(message: string) {
  await fetch(`${API_BASE}/notifications/push/send-test`, {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  return { success: true };
}
