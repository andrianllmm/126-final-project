self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        actionLink: data.actionLink,
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  event.notification.close();
  const actionLink =
    event.notification &&
    event.notification.data &&
    event.notification.data.actionLink;
  if (actionLink) {
    event.waitUntil(clients.openWindow(actionLink));
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});
