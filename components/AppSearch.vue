<template>
    <div>
        <label for="search" class="sr-only">Search</label>
        <div class="mt-2">
            <div class="flex rounded-md bg-white ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <div class="relative">
                    <Listbox as="div" v-model="selected" multiple>
                        <ListboxLabel class="sr-only">Search engine type</ListboxLabel>
                        <ListboxButton
                            class="relative flex items-center gap-2 rounded-l-md bg-white py-2.5 pr-8 pl-3 text-left text-gray-900 focus:outline-none sm:text-sm/6 min-w-0">
                            <div class="flex items-center gap-2 min-w-0">
                                <img v-if="selected.length === 1" :src="selected[0].avatar" :alt="selected[0].name"
                                    class="size-5 shrink-0 rounded-full">
                                <div v-if="selected.length === 1" class="truncate">{{ selected[0].name }}</div>
                                <div v-else class="flex items-center gap-1">
                                    <img v-for="(item, index) in selected.slice(0, 2)" :key="index" :src="item.avatar"
                                        :alt="item.name" class="size-5 shrink-0 rounded-full">
                                    <span v-if="selected.length > 2" class="text-xs text-gray-500">+{{ selected.length - 2 }}</span>
                                </div>
                            </div>
                            <ChevronUpDownIcon
                                class="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500"
                                aria-hidden="true" />
                        </ListboxButton>
                        <transition leave-active-class="transition ease-in duration-100"
                            leave-from-class="opacity-100" leave-to-class="opacity-0">
                            <ListboxOptions
                                class="absolute z-20 mt-1 max-h-56 min-w-48 max-w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
                                <ListboxOption as="template" v-for="searchType in searchTypes" :key="searchType.id"
                                    :value="searchType" v-slot="{ active, selected }"
                                    :disabled="isLastSelectedItem(searchType)">
                                    <li
                                        :class="[
                                            active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                            isLastSelectedItem(searchType) ? 'opacity-50 cursor-not-allowed' : 'cursor-default',
                                            'relative py-2 pr-9 pl-3 select-none'
                                        ]">
                                        <div class="flex items-center">
                                            <img :src="searchType.avatar" alt=""
                                                class="size-5 shrink-0 rounded-full" />
                                            <span
                                                :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">
                                                {{ searchType.name }}
                                            </span>
                                        </div>

                                        <span v-if="selected"
                                            :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                            <CheckIcon class="size-5" aria-hidden="true" />
                                        </span>
                                    </li>
                                </ListboxOption>
                            </ListboxOptions>
                        </transition>
                    </Listbox>
                </div>
                <input id="search"
                    v-model.trim="search"
                    @keyup.enter="handleSearch"
                    class="block min-w-0 grow py-2.5 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 focus:ring-0 border-none focus:border-none outline-none rounded-r-md"
                    type="search" placeholder="Search" required>
            </div>
        </div>
    </div>
</template>
// ... existing script ...
<script setup lang="ts">
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/16/solid'
import { CheckIcon } from '@heroicons/vue/20/solid'

const searchTypes = [
    {
        id: 1,
        name: 'Google',
        avatar: '/images/search-engine/google.ico',
        query: 'https://www.google.com/search?q=',
    },
    {
        id: 2,
        name: 'Bing',
        avatar: '/images/search-engine/bing.png',
        query: 'https://www.bing.com/search?q=',
    },
    {
        id: 3,
        name: 'DuckDuckGo',
        avatar:
            '/images/search-engine/duckduckgo.ico',
        query: 'https://duckduckgo.com/?q=',
    },
    {
        id: 4,
        name: 'Yandex',
        avatar:
            '/images/search-engine/yandex.png',
        query: 'https://yandex.com/search/?text=',
    },
]

const selected = ref([searchTypes[0]])
const isLastSelectedItem = (searchType: typeof searchTypes[number]) => {
    return selected.value.length === 1 && selected.value.includes(searchType)
}

const search = ref('')

const handleSearch = () => {
    if (!search.value) {
        return
    }

    const encodedQuery = encodeURIComponent(search.value)

    selected.value.forEach(searchEngine => {
        const searchUrl = searchEngine.query + encodedQuery
        navigateTo(searchUrl, { external: true, open: { target: '_blank' } })
    })
}
</script>
