/**
 * Offline Delete Queue — IndexedDB-based persistence
 * Stores pending delete operations when offline,
 * auto-syncs to Supabase when connection is restored.
 *
 * Conflict handling:
 *  - Stable keys (del_{scanId}) prevent duplicate queue entries
 *  - "Delete all" expands to individual IDs — new scans on other devices survive
 *  - Already-deleted rows → Supabase returns no error, queue entry removed silently
 */

interface QueuedDelete {
  id: string          // stable key: "del_{scanId}"
  scanId: number      // Supabase row ID to delete
  userId: string      // owner
  timestamp: number   // Date.now()
}

const DB_NAME = "cropiq_offline_queue"
const DB_VERSION = 2   // bumped — old format incompatible
const STORE_NAME = "pending_deletes"

// ── Open IndexedDB ──
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      // Drop & recreate on version change to clear old format
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME)
      }
      db.createObjectStore(STORE_NAME, { keyPath: "id" })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// ── Queue a single delete (stable key = no duplicates) ──
export async function queueDelete(scanId: number, userId: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)

  const entry: QueuedDelete = {
    id: `del_${scanId}`,    // 🔒 stable key — existing entry gets overwritten
    scanId,
    userId,
    timestamp: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const req = store.put(entry)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

// ── Queue "delete all" → expand to individual deletes ──
// Each scan gets its own stable-keyed entry.
// New scans created on other devices won't be affected.
export async function queueDeleteAll(userId: string, scanIds: number[]): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)

  // Deduplicate: existing entries for same scanIds just get timestamp updated
  for (const scanId of scanIds) {
    const entry: QueuedDelete = {
      id: `del_${scanId}`,
      scanId,
      userId,
      timestamp: Date.now(),
    }
    store.put(entry)
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// ── Get pending count ──
export async function getPendingCount(): Promise<number> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const req = store.count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// ── Get all pending items ──
async function getAllPending(): Promise<QueuedDelete[]> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// ── Remove from queue after successful sync ──
async function removeFromQueue(id: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

// ── Sync: process all pending with Supabase ──
export type SyncFn = {
  deleteOne: (scanId: number) => Promise<{ error: any }>
}

export async function processQueue(sync: SyncFn): Promise<{ synced: number; failed: number; skipped: number }> {
  const pending = await getAllPending()
  if (pending.length === 0) return { synced: 0, failed: 0, skipped: 0 }

  let synced = 0
  let failed = 0
  let skipped = 0

  for (const item of pending) {
    try {
      const { error } = await sync.deleteOne(item.scanId)

      if (error) {
        // RLS / permission / network error — keep in queue, retry later
        console.warn(`Offline sync: delete #${item.scanId} failed:`, error)
        failed++
        continue
      }

      // Success OR already deleted (Supabase returns no error for non-existent rows)
      // Either way: safe to remove from queue
      await removeFromQueue(item.id)
      synced++
    } catch (e) {
      // Unexpected error — keep in queue
      console.error(`Offline sync: delete #${item.scanId} crashed:`, e)
      failed++
    }
  }

  // Re-count after sync
  const remaining = await getPendingCount()
  return { synced, failed, skipped: 0 }
}


// ── Online check ──
export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine
}
