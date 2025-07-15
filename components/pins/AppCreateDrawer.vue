<template>
  <div>
    <TransitionRoot as="template" :show="isOpen">
      <Dialog class="relative z-50" @close="closeModal">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <form class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div class="h-0 flex-1 overflow-y-auto">
                      <div class="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div class="flex items-center justify-between">
                          <DialogTitle class="text-base font-semibold text-white">Create New Pin</DialogTitle>
                          <div class="ml-3 flex h-7 items-center">
                            <button type="button" class="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden" @click="closeModal">
                              <span class="absolute -inset-2.5" />
                              <span class="sr-only">Close panel</span>
                              <XMarkIcon class="size-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div class="mt-1">
                          <p class="text-sm text-indigo-300">Fill in at least one field.</p>
                        </div>
                      </div>
                      <div class="flex flex-1 flex-col justify-between">
                        <div class="divide-y divide-gray-200 px-4 sm:px-6">
                          <div class="space-y-6 pt-6 pb-5">
                            <div>
                              <label for="url" class="block text-sm/6 font-medium text-gray-900">URL</label>
                              <div class="mt-2">
                                <input id="url" type="url" name="url" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6" maxlength="2048" />
                              </div>
                            </div>
                            <div>
                              <label for="content" class="block text-sm/6 font-medium text-gray-900">Content</label>
                              <div class="mt-2">
                                <textarea id="content" rows="3" name="content" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6" maxlength="3000" />
                              </div>
                            </div>
                            <div>
                                <label for="record-btn" class="block text-sm/6 font-medium text-gray-900">Record</label>
                                <div class="mt-2">
                                    <button id="record-btn" type="button">
                                        <MicrophoneIcon class="mx-auto size-6" aria-hidden="true" />
                                    </button>
                                    <input type="hidden" name="audio_path">
                                </div>
                            </div>
                            <div>
                              <label for="image-upload" class="block text-sm/6 font-medium text-gray-900">Image</label>
                              <div class="mt-2">
                                <input id="image-upload" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" aria-describedby="upload-image-help" type="file" accept="image/png, image/jpeg">
                                <p id="upload-image-help" class="mt-1 text-xs/5 text-gray-500">PNG, JPG up to 5MB</p>
                                <input type="hidden" name="image_path">
                              </div>
                            </div>
                            <fieldset>
                              <legend class="text-sm/6 font-medium text-gray-900">Visibility</legend>
                              <div class="mt-2 space-y-4">
                                <div class="relative flex items-start">
                                  <div class="absolute flex h-6 items-center">
                                    <input id="privacy-public" name="privacy" value="public" type="radio" checked="" class="relative size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" />
                                  </div>
                                  <div class="pl-7 text-sm/6">
                                    <label for="privacy-public" class="font-medium text-gray-900">Public</label>
                                  </div>
                                </div>
                                <div>
                                  <div class="relative flex items-start">
                                    <div class="absolute flex h-6 items-center">
                                      <input id="privacy-private" name="privacy" value="private" type="radio" class="relative size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" />
                                    </div>
                                    <div class="pl-7 text-sm/6">
                                      <label for="privacy-private" class="font-medium text-gray-900">Private</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex shrink-0 justify-end px-4 py-4">
                      <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50" @click="closeModal">Cancel</button>
                      <button type="submit" class="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, MicrophoneIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () =>{
  isOpen.value = false
}

defineExpose({
  openModal,
  closeModal
})
</script>
