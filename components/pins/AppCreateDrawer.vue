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
                  <form class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl" method="POST">
                    <div class="h-0 flex-1 overflow-y-auto">
                      <div class="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div class="flex items-center justify-between">
                          <DialogTitle class="text-base font-semibold text-white">
                            Create New Pin
                          </DialogTitle>
                          <div class="ml-3 flex h-7 items-center">
                            <button type="button" class="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden" @click="closeModal">
                              <span class="absolute -inset-2.5" />
                              <span class="sr-only">Close panel</span>
                              <XMarkIcon class="size-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div class="mt-1">
                          <p class="text-sm text-indigo-300">
                            Fill in at least one field.
                          </p>
                        </div>
                      </div>
                      <div class="flex flex-1 flex-col justify-between">
                        <div class="divide-y divide-gray-200 px-4 sm:px-6">
                          <div class="space-y-6 pt-6 pb-5">
                            <div v-if="errors.message">
                              <p class="mt-2 text-sm text-red-600">{{ errors.message }}</p>
                            </div>
                            <div>
                              <label for="url" class="block text-sm/6 font-medium text-gray-900">URL</label>
                              <div class="mt-2">
                                <input
                                  v-model.trim="pinForm.url"
                                  id="url"
                                  type="url"
                                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6" maxlength="2048"
                                >
                                <div
                                  v-if="errors.details.url.length > 0"
                                  class="mt-2 text-sm text-red-600">
                                  <ul class="list-disc">
                                    <li v-for="error in errors.details.url" :key="error">
                                      {{ error }}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label for="content" class="block text-sm/6 font-medium text-gray-900">Content</label>
                              <div class="mt-2">
                                <textarea
                                  v-model.trim="pinForm.content"
                                  id="content"
                                  rows="3"
                                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6" maxlength="3000" />
                                <div
                                  v-if="errors.details.content.length > 0"
                                  class="mt-2 text-sm text-red-600">
                                  <ul class="list-disc">
                                    <li v-for="error in errors.details.content" :key="error">
                                      {{ error }}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div>
                                <label for="record-btn" class="block text-sm/6 font-medium text-gray-900">Record</label>
                                <div class="mt-2">
                                    <button
                                      id="record-btn"
                                      type="button"
                                      :disabled="asyncStates.isAudioUploading"
                                      :class="[
                                        'rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 w-full items-center',
                                        asyncStates.isAudioUploading ? 'cursor-progress' : ''
                                      ]"
                                      @click="toggleRecording"
                                    >
                                        <div v-if="asyncStates.isRecording" class="inline-flex items-center justify-center gap-x-1.5">
                                            <StopIcon class="mx-auto size-5 -ml-0.5 animate-pulse text-red-600" aria-hidden="true" />
                                            <span>
                                                Stop Recording
                                            </span>
                                        </div>
                                        <div v-if="!asyncStates.isRecording && !asyncStates.isAudioUploading" class="inline-flex items-center justify-center gap-x-1.5">
                                            <MicrophoneIcon class="mx-auto size-5 -ml-0.5" aria-hidden="true" />
                                            <span>
                                                Start Recording
                                            </span>
                                        </div>
                                        <div v-if="asyncStates.isAudioUploading" class="mt-1">
                                          <span>Uploading audio...</span>
                                        </div>
                                    </button>
                                    <div v-if="asyncStates.isRecording" class="mt-1 text-sm text-gray-600">
                                        {{ recordingTime }}s/15s
                                    </div>
                                    <div v-if="audioPreviewUrl" class="mt-1 space-x-2">
                                        <audio :src="audioPreviewUrl" controls class="flex w-full" />
                                        <button
                                          v-if="pinForm.audio_path"
                                          @click="deleteRecording"
                                          class="ml-auto block mt-1 text-xs/5 text-gray-500"
                                        >
                                          <span>Delete recording</span>
                                        </button>
                                    </div>
                                    <div
                                      v-if="errors.details.audio_path.length > 0"
                                      class="mt-2 text-sm text-red-600">
                                      <ul class="list-disc">
                                       <li v-for="error in errors.details.audio_path" :key="error">
                                          {{ error }}
                                        </li>
                                      </ul>
                                    </div>
                                    <input v-model="pinForm.audio_path" type="hidden">
                                </div>
                            </div>
                            <div>
                              <label for="upload-image" class="block text-sm/6 font-medium text-gray-900">Image</label>
                              <div class="mt-2">
                                <input
                                  id="upload-image"
                                  ref="imageInputRef"
                                  @change="handleImageSelect"
                                  :class="imageInputState.classes"
                                  aria-describedby="upload-image-help"
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  :disabled="imageInputState.isDisabled"
                                >
                                <p id="upload-image-help" class="mt-1 text-xs/5 text-gray-500">PNG, JPG up to 5MB</p>
                                <div
                                  v-if="errors.details.image_path.length > 0"
                                  class="mt-2 text-sm text-red-600">
                                  <ul class="list-disc">
                                    <li v-for="error in errors.details.image_path" :key="error">
                                      {{ error }}
                                    </li>
                                  </ul>
                                </div>
                                <div v-if="imageRawName" class="mt-2 flex items-start justify-between">
                                    <span class="text-sm font-medium text-gray-900 truncate">
                                        {{ imageRawName }}
                                    </span>
                                    <div class="ml-3 flex h-7 items-center">
                                        <button
                                          v-if="!asyncStates.isCreatingPin"
                                          type="button"
                                          :disabled="asyncStates.isCreatingPin"
                                          @click="clearImage"
                                          class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-hidden"
                                        >
                                          <span class="absolute -inset-2.5" />
                                          <span class="sr-only">Clear image</span>
                                          <XMarkIcon class="size-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                                <input v-model="pinForm.image_path" type="hidden">
                              </div>
                            </div>
                            <fieldset>
                              <legend class="text-sm/6 font-medium text-gray-900">Visibility</legend>
                              <div class="mt-2 space-y-4">
                                <div class="relative flex items-start">
                                  <div class="absolute flex h-6 items-center">
                                    <input
                                        :id="PinVisibilityPublic.id"
                                        v-model="pinForm.visibility"
                                        :value="PinVisibilityPublic.val"
                                        type="radio"
                                        name="visibility"
                                        class="relative size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                    >
                                  </div>
                                  <div class="pl-7 text-sm/6">
                                    <label
                                        :for="PinVisibilityPublic.id"
                                        class="font-medium text-gray-900"
                                    >
                                        {{ PinVisibilityPublic.title }}
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <div class="relative flex items-start">
                                    <div class="absolute flex h-6 items-center">
                                      <input
                                        :id="PinVisibilityPrivate.id"
                                        v-model="pinForm.visibility"
                                        :value="PinVisibilityPrivate.val"
                                        name="visibility"
                                        type="radio"
                                        checked
                                        class="relative size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                    >
                                    </div>
                                    <div class="pl-7 text-sm/6">
                                      <label
                                        :for="PinVisibilityPrivate.id"
                                        class="font-medium text-gray-900"
                                      >
                                        {{ PinVisibilityPrivate.title }}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  v-if="errors.details.visibility.length > 0"
                                  class="mt-2 text-sm text-red-600">
                                  <ul class="list-disc">
                                    <li v-for="error in errors.details.visibility" :key="error">
                                      {{ error }}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex shrink-0 justify-end px-4 py-4">
                      <button
                        type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                        @click="closeModal"
                      >
                          Cancel
                      </button>
                      <button
                        type="button"
                        :disabled="createPinBtnState.isDisabled"
                        :class="createPinBtnState.classes"
                        @click="handleCreatePin"
                      >
                         {{ createPinBtnState.text }}
                      </button>
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
import * as v from 'valibot';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, MicrophoneIcon } from '@heroicons/vue/24/outline'
import { StopIcon } from '@heroicons/vue/24/solid'

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  clearErrors()
  clearImage()
  deleteRecording()

  asyncStates.isImageUploading = false
  asyncStates.isRecording = false
  asyncStates.isCreatingPin = false
  asyncStates.isAudioUploading = false

  pinForm.url = ''
  pinForm.content = ''
  pinForm.audio_path = ''
  pinForm.image_path = ''
  pinForm.visibility = PinVisibility.PRIVATE
}

defineExpose({
  openModal,
  closeModal
})

const pinForm = reactive<PinForm>({
    url: '',
    content: '',
    audio_path: '',
    image_path: '',
    visibility: PinVisibility.PRIVATE,
})

const errors = ref<ValidationPinErrors>({
    "message": "",
    "details": {
        url: [],
        content: [],
        audio_path: [],
        image_path: [],
        visibility: [],
    },
})

const asyncStates = reactive({
  isImageUploading: false,
  isRecording: false,
  isAudioUploading: false,
  isCreatingPin: false,
})

const recordingTime = ref(0)
const mediaStream = ref<MediaStream | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const audioPreviewUrl = ref<string | null>(null)
const audioBlob = ref<Blob | null>(null)
let recordingTimerId: NodeJS.Timeout | null = null

const imageInputState = computed(() => {
  const isDisabled = asyncStates.isImageUploading || asyncStates.isCreatingPin

  let classes = 'block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none'
  if (isDisabled === false) {
    classes = `${classes} cursor-pointer`
  }

  if (asyncStates.isImageUploading) {
    classes = `${classes} cursor-progress`
  }

  if (asyncStates.isCreatingPin) {
    classes = `${classes} cursor-not-allowed`
  }

  return {
    isDisabled,
    classes,
  }
})

const createPinBtnState = computed(() => {
  const baseClasses = 'ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs'
  const isDisabled = asyncStates.isImageUploading || asyncStates.isRecording || asyncStates.isCreatingPin || asyncStates.isAudioUploading
  const text = asyncStates.isCreatingPin ? 'Saving...' : 'Save'

  let classes = ''
  if (isDisabled) {
    const disabledBaseClasses = 'hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 sm:w-auto dark:disabled:bg-indigo-800 '
    if (asyncStates.isCreatingPin) {
      classes = `${baseClasses} ${disabledBaseClasses} cursor-progress`
    } else {
      classes = `${baseClasses} ${disabledBaseClasses} cursor-not-allowed`
    }
  } else {
    classes = `${baseClasses} hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer`
  }

  return {
    isDisabled,
    text,
    classes,
  }
})

const imageInputRef = ref<HTMLInputElement>()
const imageRawName = ref('')

const handleImageSelect = async (e: Event) => {
  if (asyncStates.isImageUploading || asyncStates.isCreatingPin) {
    return
  }

  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  errors.value.details.image_path = []
  try {
    v.parse(ValidatorPinImageSchema, file)
  } catch (error) {
    if (error instanceof v.ValiError) {
      const flatErrors = v.flatten(error.issues)
      errors.value.details.image_path = flatErrors.root || []
    } else {
        errors.value.message = 'An unknown error occurred.'
    }
    return
  }

  asyncStates.isImageUploading = true
  errors.value.message = ''
  try {
    const response = await pinUploadImage(file)
    if (!response || response.code !== 0 || !response.data) {
      return
    }
    asyncStates.isImageUploading = false
    imageRawName.value = file.name
    pinForm.image_path = response.data.path
  } catch (error) {
    asyncStates.isImageUploading = false
    pinForm.image_path = ''
    errors.value.message = 'Failed to upload image, please try again.'
    console.error('Upload error:', error)
  } finally {
    asyncStates.isImageUploading = false
  }
}

const handleCreatePin = async () => {
  clearErrors()
  try {
    v.parse(ValidatorPinFormSchema, pinForm)
  } catch (error) {
    if (error instanceof v.ValiError) {
      const flatErrors = v.flatten(error.issues)
      if (flatErrors.root && flatErrors.root.length > 0) {
        errors.value.message = flatErrors.root[0]
      }
      if (flatErrors.nested) {
        Object.keys(flatErrors.nested).forEach(key => {
          const fieldKey = key as keyof ValidationPinErrorDetails
          if (flatErrors.nested && flatErrors.nested[fieldKey]) {
            errors.value.details[fieldKey] = flatErrors.nested[fieldKey] as string[]
          }
        })
      }
    } else {
        errors.value.message = 'An unknown error occurred.'
    }
    return
  }

  asyncStates.isCreatingPin = true

  try {
    const response = await createPin(pinForm)
    if (!response || response.code !== 0 || !response.data) {
      errors.value.message = 'Failed to create pin. Please try again.'
      return
    }
    closeModal()
  } catch (error) {
    asyncStates.isCreatingPin = false
    errors.value.message = 'Failed to create pin. Please try again.'
    console.error('Upload error:', error)
  } finally {
    asyncStates.isCreatingPin = false
  }
}

const clearImage = () => {
  pinForm.image_path = ''
  imageRawName.value = ''
  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
}

const clearErrors = () => {
  errors.value.message = ''
  errors.value.details = {
    url: [],
    content: [],
    audio_path: [],
    image_path: [],
    visibility: [],
  }
}

const startRecording = async() => {
  if (asyncStates.isAudioUploading  || asyncStates.isRecording) {
    return
  }

  pinForm.audio_path = ""
  errors.value.details.audio_path = []
  deleteRecording()

  try {
    mediaStream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(mediaStream.value)

    audioChunks.value = []
    mediaRecorder.value.ondataavailable = (e) => {
      audioChunks.value.push(e.data)
    }

    mediaRecorder.value.onstop = async() => {
        audioBlob.value = new Blob(audioChunks.value, { type: "audio/webm" })
        if (mediaStream.value) {
            mediaStream.value.getTracks().forEach(track => track.stop())
            mediaStream.value = null
        }

        audioPreviewUrl.value = URL.createObjectURL(audioBlob.value)

        handleAudioUpload()
    }

    mediaRecorder.value.start()
    asyncStates.isRecording = true

    recordingTime.value = 0
    recordingTimerId = setInterval(() => {
        recordingTime.value++
        if (recordingTime.value >= 15) {
            stopRecording()
        }
    }, 1000)
  } catch (error) {
    asyncStates.isRecording = false
    errors.value.details.audio_path = ["Failed to start recording."]
    console.error('Failed to start recording:', error)
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
  }
  asyncStates.isRecording = false
  if (recordingTimerId) {
    clearInterval(recordingTimerId)
    recordingTimerId = null
  }
}

const deleteRecording = () => {
  if (audioPreviewUrl.value) {
    URL.revokeObjectURL(audioPreviewUrl.value)
  }

  recordingTime.value = 0
  audioPreviewUrl.value = null
  pinForm.audio_path = ""
  errors.value.details.audio_path = []

  if (audioBlob.value) {
    audioBlob.value = null
  }
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
  }
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }
  asyncStates.isRecording = false
  asyncStates.isAudioUploading = false
  if (recordingTimerId) {
    clearInterval(recordingTimerId)
    recordingTimerId = null
  }
}

const toggleRecording = () => {
  if (asyncStates.isAudioUploading) {
    return
  }

  if (asyncStates.isRecording) {
    stopRecording()
  } else {
    startRecording()
  }
}

const handleAudioUpload = async () => {
  if (!audioBlob.value) { 
    return
  }

  asyncStates.isAudioUploading = true

  try {
      const audioFile = new File([audioBlob.value], 'recording.webm', { type: 'audio/webm' })
      const response = await pinUploadAudio(audioFile)
      if (!response || response.code !== 0 || !response.data) {
        errors.value.details.audio_path = ["Failed to upload audio"]
        return
      }
      pinForm.audio_path = response.data.path
      if (pinForm.content === '' && response.data.text) {
        pinForm.content = response.data.text
      }
      setTimeout(() => {
        asyncStates.isAudioUploading = false
      }, 1500)
  } catch (error) {
      errors.value.details.audio_path = ["Failed to upload audio."]
      console.error('Failed to upload audio:', error)
      asyncStates.isAudioUploading = false
  }
}
</script>
