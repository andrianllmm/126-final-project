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
    const errorBody = await response.text();
    throw new Error(`Failed: ${response.status} ${errorBody}`);
  }

  return { success: true, response };
}

export async function unsubscribeUser(endpoint?: string) {
  const response = await fetch(`${API_BASE}/notifications/push/unsubscribe`, {
    method: 'DELETE',
    body: JSON.stringify({ endpoint }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed: ${response.status} ${errorBody}`);
  }

  return { success: true, response };
}

export async function sendNotification(message: string) {
  const response = await fetch(`${API_BASE}/notifications/push/send-test`, {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed: ${response.status} ${errorBody}`);
  }

  return { success: true, response };
}
