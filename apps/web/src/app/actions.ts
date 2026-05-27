'use server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function subscribeUser(sub: PushSubscription) {
  await fetch(`${API_BASE}/notifications/push/subscribe`, {
    method: 'POST',
    body: JSON.stringify(sub),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

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
