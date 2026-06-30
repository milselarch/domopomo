// frontend/src/runtime/wailsEvents.ts
import { Events } from '@wailsio/runtime'
import type { Store } from 'vuex'
import { DateTime } from 'luxon'

type RootState = {
  count: number
  desktop_timestamp: number
}

type TimeEventPayload = {
  name: string
  data: string
}

export function startWailsEventBridge(store: Store<RootState>) {
  const offTime = Events.On('time', (event: TimeEventPayload) => {
    const rawDateInput = event.data
    // Normalize +08 -> +0800 (or +08:00) for robust parsing
    const normalized = rawDateInput.replace(/([+-]\d{2})$/, '$100')
    // normalize payload shape if needed
    const dt = DateTime.fromFormat(normalized, "ccc, dd LLL yyyy HH:mm:ss ZZZ")
    const timestampMs = dt.isValid ? dt.toMillis() : -1
    store.commit('setTimestamp', timestampMs)
  })

  // return cleanup for dev/HMR or teardown
  return () => {
    try { offTime?.() } catch {}
  }
}
