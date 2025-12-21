<script lang="ts" setup>
import {reactive} from 'vue'
import {Greet} from '../../wailsjs/go/main/App'
import {BTabItem, BTabs} from "buefy";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

type TabHeader = {
  title: string
  icon: string
}

const TAB_HEADERS: TabHeader[] = [
  {title: "Home", icon: "fas fa-home"},
  {title: "Settings", icon: "fas fa-gear"},
  {title: "About", icon: "fas fa-circle"},
]

const data = reactive({
  tabIndex: 1,
})

const onTabChange = (newIndex: number) => {
  console.log("Tab changed to index:", newIndex)
  data.tabIndex = newIndex
}

/*
function greet() {
  Greet("HELLO WORLB").then(result => {
    data.resultText = result
  })
}
*/

</script>

<template>
  <main>
    <b-tabs
      position="is-centered"
      class="tabs-block"
      v-model="data.tabIndex"
      v-on:change="onTabChange"
      type="is-boxed"
      :hoverable="true"
    >
      <b-tab-item v-for="tabHeader in TAB_HEADERS" :key="tabHeader.title">
        <template #header>
          <span class="tab-head-name">
            <font-awesome-icon :icon="tabHeader.icon" class="icon alt" />
            {{ tabHeader.title }}
          </span>
        </template>

        <div class="tab-wrapper">
          Content for {{ tabHeader.title }}
        </div>
      </b-tab-item>
    </b-tabs>
  </main>
</template>

<style lang="scss">
.tabs-block {
  margin-top: 0.5rem;
  font-family: "Bebas Neue", sans-serif;
}

.main-tab-item {
  font-family: "Bebas Neue", sans-serif;
  font-size: 1rem;
}

.result {
  height: 20px;
  line-height: 20px;
  margin: 1.5rem auto;
}

.input-box .btn {
  width: 60px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  border: none;
  margin: 0 0 0 20px;
  padding: 0 8px;
  cursor: pointer;
}

.input-box .btn:hover {
  background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  color: #333333;
}

.input-box .input {
  border: none;
  border-radius: 3px;
  outline: none;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  background-color: rgba(240, 240, 240, 1);
  -webkit-font-smoothing: antialiased;
}

.input-box .input:hover {
  border: none;
  background-color: rgba(255, 255, 255, 1);
}

.input-box .input:focus {
  border: none;
  background-color: rgba(255, 255, 255, 1);
}
</style>
