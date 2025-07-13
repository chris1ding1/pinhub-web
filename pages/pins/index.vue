<template>
    <div>
        <main>
            <h1 class="sr-only">
                {{ title }}
            </h1>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ul v-if="pins?.data?.items?.length" role="list" class="columns-2 sm:columns-3 lg:columns-4 gap-x-6 xl:gap-x-8 mt-10 mb-30">
            <li
                v-for="pin in pins.data.items"
                :key="pin.id"
                class="mb-8 break-inside-avoid"
            >
                <div :class="[
                    'relative',
                    isImageOnly(pin)? '': 'border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3',
                    ]">
                    <img
                        v-if="pin.image_url"
                        :src="pin.image_url"
                        @click="openImageModal(pin.image_url)"
                        class="rounded-lg aspect-10/7 object-cover group-hover:opacity-75"
                    >
                    <p
                        class="text-sm font-medium text-gray-900 line-clamp-3 break-words"
                    >
                        {{ pin.content || (pin.url ? pin.url : "") }}
                    </p>
                    <audio
                        v-if="pin.audio_url"
                        :src="pin.audio_url"
                        controls
                        class="w-full rounded"
                    />
                    <a
                        v-if="pin.url"
                        :href="pin.url"
                        :title="pin.url"
                        target="_blank"
                        rel="nofollow noopener"
                        class="inline-block truncate text-sm text-gray-500 max-w-full"
                    >
                        {{ pin.url_host }}
                    </a>
                </div>
            </li>
                </ul>
            </div>
            <PinsAppImageModal :is-open="isImageModalOpen" :image-url="modalImageUrl" @close="closeImageModal" />
        </main>
    </div>
</template>
<script setup lang="ts">
const title = 'Pins'

useHead({
  title: title,
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const pinsParamPage = ref(1)
const pinsParamSearch = ref("")
const pins = ref({})

async function getPinsIndex() {
    const response = await $fetch('/pins', {
        query: {
            page: pinsParamPage.value,
            search: pinsParamSearch.value,
        },
        baseURL: apiBase,
    })

    if (response.code === 0) {
        pins.value = response
    }
}
getPinsIndex()

const isImageOnly = (pin: any) => {
  return pin.image_url && !pin.content && !pin.url
}

const { isOpen: isImageModalOpen, imageUrl: modalImageUrl, openModal, closeModal: closeImageModal } = usePinImageModal()

const openImageModal = (imageUrl: string) => {
  openModal(imageUrl)
}
</script>
