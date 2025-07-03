<template>
  <div>
    <input v-model="search" type="search" placeholder="Search">
  </div>
</template>
<script setup lang="ts">
const search = ref('')
const searchTypes = ref([
    {"name": "Google", "query": "https://www.google.com/search?q="},
    {"name": "Bing", "query": "https://www.bing.com/search?q="},
    {"name": "DuckDuckGo", "query": "https://duckduckgo.com/?q="},
    {"name": "Yandex", "query": "https://yandex.com/search/?text="},
    //{"name": "Ecosia", "query": "https://www.ecosia.org/search?q="},
])
</script>
