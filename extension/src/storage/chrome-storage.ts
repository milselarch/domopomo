type StorageArea = chrome.storage.StorageArea

class ChromeStorage {
  private storage: StorageArea

  constructor(storage: StorageArea) {
    this.storage = storage
  }

  async getItem<T = unknown>(key: string): Promise<T | undefined> {
    const value = await this.storage.get(key)
    return value[key] as T | undefined
  }

  async setItem<T>(key: string, data: T): Promise<T> {
    await this.storage.set({ [key]: data })
    return data
  }

  removeItem(key: string): Promise<void> {
    return this.storage.remove(key)
  }

  clear(): Promise<void> {
    return this.storage.clear()
  }

  // Mirrors your original behavior: total bytes in use for this storage area.
  length(): Promise<number> {
    return this.storage.getBytesInUse()
  }

  async key(keyIndex: number): Promise<string | undefined> {
    const value = await this.storage.get()
    return Object.keys(value)[keyIndex]
  }
}

export const ChromeSyncStorage = new ChromeStorage(chrome.storage.sync)
export const ChromeLocalStorage = new ChromeStorage(chrome.storage.local)

export { ChromeStorage }
