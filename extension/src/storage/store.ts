import VuexPersistence from 'vuex-persist'
import { createStore } from 'vuex'
import { ChromeSyncStorage } from '~/storage/chrome-storage'

interface VuexAsyncStorage {
  getItem<T>(key: string): Promise<T>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
}

const vuexStorageAdapter: VuexAsyncStorage = {
  async getItem<T>(key: string): Promise<T> {
    const value = await ChromeSyncStorage.getItem<T>(key)
    return (value ?? null) as T
  },
  async setItem<T>(key: string, value: T): Promise<void> {
    await ChromeSyncStorage.setItem(key, value)
  },
  async removeItem(key: string): Promise<void> {
    await ChromeSyncStorage.removeItem(key)
  },
}

const storage = new VuexPersistence({
  asyncStorage: true,
  storage: vuexStorageAdapter,
})

export const store = createStore({
  state() {
    return {
      count: 0,
    }
  },
  mutations: {
    increment(state) {
      state.count++
    },
  },
  getters: {
    count(state) {
      return state.count
    },
  },
  plugins: [storage.plugin],
})
