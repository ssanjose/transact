export default function getDatabase(): IDBDatabase | undefined {
  let db;

  if (typeof window !== 'undefined') {
    const request = window.indexedDB.open('FinanceTrackingDB', 1);

    request.onerror = function (event) {
      console.error('Database error:');
    }
    request.onsuccess = function (event) {
      console.log('Database opened successfully');
    };

    request.onupgradeneeded = function (event) {
      if (event.target instanceof IDBOpenDBRequest) {
        db = event.target.result;
      }
    };
  }

  return db;
}