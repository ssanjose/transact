/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { SWMessageType } from "../lib/types/sw";
import { AccountService } from "../services/account.service";

self.addEventListener('install', e => {
  console.log('Service Worker Installed', e);
});
self.addEventListener('activate', async (e) => {
  console.log('Service Worker Activated', e);
});
self.addEventListener('message', async (event: ExtendableMessageEvent) => {
  const message: SWMessageType = event.data;
  switch (message.action) {
    case 'COMMIT_TRANSACTIONS':
      await AccountService.applyTransactionsToAccount();
      break;
    // ... other cases
    default:
      break;
  }
});