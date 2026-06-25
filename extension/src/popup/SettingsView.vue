<script setup lang="ts">
import { BField, BIcon } from 'buefy'
</script>

<template>
  <div class="settings-view">
    <p> DOMOPOMO SETTINGS </p>

    <BField class="end-field">
      <div class="end-field-content">
        <BIcon
          v-show="!isDarkMode"
          pack="fas"
          icon="sun"
          size="is-large"
          @click="setDarkMode"
        />
        <BIcon
          v-show="isDarkMode"
          pack="fas"
          icon="moon"
          size="is-large"
          @click="setLightMode"
        />
        <!-- <p>light</p> -->
        <!-- <b-icon pack="fas" icon="circle" size="is-medium" /> -->
        <!-- <b-switch v-model="isDarkMode"></b-switch> -->
        <!-- <b-icon pack="fas" icon="moon" size="is-medium" /> -->
        <!-- <p>{{ themeMode }}</p> -->
        <!-- <p>dark</p> -->
      </div>
    </BField>
  </div>
</template>

<style scoped>

</style>
