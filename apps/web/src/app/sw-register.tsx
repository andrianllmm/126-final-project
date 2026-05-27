'use client';

import { useEffect } from 'react';
import { subscribeUser, sendNotification } from './actions';

export default function SWRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      (async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');

          if (!('PushManager' in window)) return;

          // helper to convert VAPID key
          function urlBase64ToUint8Array(base64String: string) {
            const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
            const base64 = (base64String + padding)
              .replace(/-/g, '+')
              .replace(/_/g, '/');
            const rawData = window.atob(base64);
            return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
          }

          // check existing subscription
          const existing = await reg.pushManager.getSubscription();

          if (existing) {
            // already subscribed; nothing to do
            return;
          }

          // only attempt to subscribe if permission not denied
          if (Notification.permission === 'denied') return;

          // trigger permission prompt and subscribe
          const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (!vapidKey) return;

          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
          });

          // send subscription to server via server action
          try {
            await subscribeUser(JSON.parse(JSON.stringify(sub)));
            // send a test push so user sees how it looks
            await sendNotification(
              'Welcome! This is a test push notification.',
            );
          } catch (e) {
            // ignore server errors
            console.error('Failed to save/send subscription', e);
          }
        } catch (err) {
          // registration failed or subscription rejected
          // swallow errors to avoid breaking page load
          console.debug(err);
        }
      })();
    }
  }, []);

  return null;
}
