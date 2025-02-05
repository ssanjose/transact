/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { AccountService } from "../services/account.service";

self.addEventListener('install', e => {
  console.log('Service Worker Installed', e);
});
self.addEventListener('activate', e => {
  console.log('Service Worker Activated', e);
  return AccountService.applyTransactionsToAccount();
});
self.addEventListener('message', e => {
  const data = e.data.split(" ");
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage(data));
  });
  console.log("Message from parent:", e.data);
});