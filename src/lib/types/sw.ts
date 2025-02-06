export type SWMessageType = {
  action: 'CACHE_DATA' | 'SYNC_DATA' | 'CLEAR_CACHE' | 'CHECK_UPDATES' | 'COMMIT_TRANSACTIONS';
  data?: {
    url?: string;
    payload?: unknown;
    timestamp?: number;
    version?: string;
    key?: string;
  };
}