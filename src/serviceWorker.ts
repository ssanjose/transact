/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { AccountService } from "./services/account.service";

self.addEventListener('install', e => {
  e.waitUntil(
    Promise.resolve().then(() => {
      console.log('Service Worker Installed');
    })
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.resolve().then(() => {
      console.log('Service Worker Activated');
      return AccountService.applyTransactionsToAccount();
    })
  );
});
self.addEventListener('message', e => {
  const data = e.data.split(" ");
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage(data));
  });
  console.log("Message from parent:", e.data);
});