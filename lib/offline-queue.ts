/**
 * Offline Delete Queue — IndexedDB-based persistence
 * Stores pending delete operations when offline,
 * auto-syncs to Supabase when connection is restored.
 */

interface QueuedDelete {
  id: string          // unique ID for this queue entry
  scanId: number      // Supabase row ID to delete
  userId: string      // owner
  operation: "delete_one" | "delete_all"
  timestamp: number   // Date.now()
}

const DB_NAME = "cropiq_offline_queue"
const DB_VERSION = 1
const STORE_NAME = "pending_deletes"

// ── Open IndexedDB ──
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// ── Queue a delete operation ──
export async function queueDelete(scanId: number, userId: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)

  const entry: QueuedDelete = {
    id: `del_${scanId}_${Date.now()}`,
    scanId,
    userId,
    operation: "delete_one",
    timestamp: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const req = store.put(entry)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

// ── Queue "delete all" operation ──
export async function queueDeleteAll(userId: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)

  const entry: QueuedDelete = {
    id: `del_all_${Date.now()}`,
    scanId: 0,
    userId,
    operation: "delete_all",
    timestamp: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const req = store.put(entry)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

// ── Get all pending operations ──
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

// ── Remove a single queue item ──
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

// ── Clear entire queue ──
async function clearQueue(): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const req = store.clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

// ── Sync: process all pending with Supabase ──
export type SyncFn = {
  deleteOne: (scanId: number) => Promise<{ error: any }>
  deleteAll: (userId: string) => Promise<{ error: any }>
}

export async function processQueue(sync: SyncFn): Promise<{ synced: number; failed: number }> {
  const pending = await getAllPending()
  if (pending.length === 0) return { synced: 0, failed: 0 }

  let synced = 0
  let failed = 0

  for (const item of pending) {
    try {
      if (item.operation === "delete_all") {
        const { error } = await sync.deleteAll(item.userId)
        if (error) { failed++; continue }
        // Delete all means all individual items for this user are also handled
        // Remove all entries for this user
        await clearQueue()
        synced += pending.length
        return { synced, failed }
      } else {
        const { error } = await sync.deleteOne(item.scanId)
        if (error) { failed++; continue }
        await removeFromQueue(item.id)
        synced++
      }
    } catch {
      failed++
    }
  }

  return { synced, failed }
}


export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine
}
