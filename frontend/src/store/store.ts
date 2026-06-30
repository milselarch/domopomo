import { createApp } from 'vue'
import { createStore } from 'vuex'
import {startWailsEventBridge} from "../runtime/wailsEvents";

type State = {
  count: number,
  desktop_timestamp: number
}

// Create a new store instance.
const store = createStore({
  state (): State {
    return {
      count: 0,
      desktop_timestamp: -1
    }
  },
  mutations: {
    increment (state: State) {
      state.count++
    },
    setTimestamp(state: State, timestamp: number) {
      state.desktop_timestamp = timestamp
    }
  }
})

const app = createApp({ /* your root component */ })
// Install the store instance as a plugin
app.use(store)
startWailsEventBridge(store)
