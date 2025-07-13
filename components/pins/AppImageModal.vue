<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" :open="isOpen" @close="closeModal" class="relative z-20">
            <button class="sr-only" @click="closeModal">Close</button>
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="w-full max-w-2xl transform overflow-hidden text-center align-middle transition-all flex items-center justify-center sm:p-6">
                            <div>
                                <img
                                    v-if="imageUrl"
                                    :src="imageUrl"
                                    class="max-w-full max-h-full object-contain"
                                >
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script setup lang="ts">
import { Dialog, DialogPanel,  TransitionRoot, TransitionChild } from '@headlessui/vue'

defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        default: "",
    },
})

const emit = defineEmits(['close'])

const closeModal = () => {
    emit('close')
}
</script>
