import type { AsyncStorage } from 'vuex-persist'
import VuexPersistence from 'vuex-persist'
import type { Store } from 'vuex'
import { createStore } from 'vuex'
import { ChromeSyncStorage } from '~/storage/chrome-storage'
import type { BlockRules } from '~/rules'

/*
interface VuexAsyncStorage {
  getItem<T>(key: string): Promise<T>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
}
*/

export interface RootState {
  counter: number // for testing lol
  lastVersion: string // last recorded data version
  /*
  map rule id to rule
  TODO: unsaved rules should use a negative rule ID
  */
  rules: Map<number, BlockRules>
  // map rule name to rule ID, for checking if a rule name is already taken
  nameReservations: Map<string, number>
}

const vuexStorageAdapter: AsyncStorage = {
  async getItem<T>(key: string): Promise<T> {
    const value = await ChromeSyncStorage.getItem<T>(key)
    return value as T
  },
  async setItem<T>(key: string, data: T): Promise<T> {
    await ChromeSyncStorage.setItem(key, data)
    return data
  },
  async removeItem(key: string): Promise<void> {
    await ChromeSyncStorage.removeItem(key)
  },
  async clear(): Promise<void> {
    // implement based on your Chrome storage wrapper API
    // e.g. await ChromeSyncStorage.clear()
  },
  async length(): Promise<number> {
    // implement based on your wrapper, or return computed key count
    return 0
  },
  key: async (keyIndex: number): Promise<string> => {
    const all = await chrome.storage.sync.get(null)
    const keys = Object.keys(all)
    return keys[keyIndex]
  },
}

export const StoreKey: InjectionKey<Store<RootState>> = Symbol('vuex-key')

const storage = new VuexPersistence({
  asyncStorage: true,
  storage: vuexStorageAdapter,
})

export const store = createStore({
  state(): RootState {
    return {
      lastVersion: '',
      nameReservations: new Map<string, number>(),
      rules: new Map<number, BlockRules>(),
      counter: 0,
    }
  },
  mutations: {
    increment(state: RootState) {
      state.counter++
    },
  },
  getters: {
    count(state: RootState) {
      return state.counter
    },
  },
  plugins: [storage.plugin],
})
