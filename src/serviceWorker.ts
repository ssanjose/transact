/// <reference lib="webworker" />

self.addEventListener('install', e => {
  console.log('Service Worker Installed')
});
self.addEventListener('activate', e => {
  console.log('Service Worker Activated')
});
self.addEventListener('message', e => {
  let data = new Array(e.data.split(" "))
  self.postMessage(data)
  console.log("Message from parent: " + e.data)
});
