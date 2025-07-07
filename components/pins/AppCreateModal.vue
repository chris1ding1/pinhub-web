<template>
  <div>
    <button
        data-modal-target="create-pin-modal"
        data-modal-toggle="create-pin-modal"
        class="fixed end-6 bottom-6 flex items-center justify-center text-white bg-blue-700 rounded-lg w-14 h-14 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
        type="button"
    >
        <svg class="w-5 h-5 transition-transform group-hover:rotate-45" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
        </svg>
        <span class="sr-only">Create new pin</span>
    </button>
    <!-- Main modal -->
    <div id="create-pin-modal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow-sm ">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 ">
                        Create New Pin
                    </h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="create-pin-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form class="p-4 md:p-5" method="POST">
                    <div>
                        <p v-if="errors && errors.msg" class="mt-2 text-sm text-red-800">
                            {{ errors.msg }}
                        </p>
                        <div v-if="errors && errors.items.length > 0" class="mt-2 text-sm text-red-700">
                            <ul
                                role="list"
                                class="list-disc space-y-1 pl-5"
                            >
                                <li
                                v-for="(error, index) in errors.items"
                                :key="index"
                                >
                                {{ error }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="grid gap-4 mb-4 grid-cols-2">
                        <div class="col-span-2">
                            <label for="url" class="block mb-2 text-sm font-medium text-gray-900 ">
                                URL
                            </label>
                            <input v-model="createPinForm.url" id="url" type="url" name="url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="URL" maxlength="2048">
                        </div>
                        <div class="col-span-2">
                            <label for="content" class="block mb-2 text-sm font-medium text-gray-900">
                                Content
                            </label>
                            <textarea
                                v-model="createPinForm.content"
                                id="content"
                                rows="4"
                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write pin content here" maxlength="3000"></textarea>
                        </div>
                        <div class="col-span-2">
                            <label class="block mb-2 text-sm font-medium text-gray-900 ">
                                Recorder
                            </label>
                            <button @click="toggleRecording" type="button" class="text-white inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-800 focus:ring-blue-300">
                                {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
                            </button>
                            <p v-if="recordingTime > 0" class="mt-2 text-gray-700">
                                Recording: {{ recordingTime }} seconds
                            </p>
                            <div v-if="audioUrl" class="mt-4 space-y-2">
                                <audio :src="audioUrl" controls class="w-full rounded shadow" />
                                <button @click="deleteRecording" class="text-sm text-red-600 underline">
                                    Delete Recording
                                </button>
                            </div>
                            <div
                                v-if="uploadAudioError"
                                class="mt-2 text-sm text-red-800"
                            >
                                <ExclamationCircleIcon class="pointer-events-none mr-3 size-5 self-center text-red-500 sm:size-4" aria-hidden="true" />
                                {{ uploadAudioError }}
                            </div>
                            <input v-model="createPinForm.audio_path" type="hidden">
                        </div>
                        <div class="col-span-2">
                            <label class="block mb-2 text-sm font-medium text-gray-900" for="up_file">Image</label>
                            <input
                                @change="handleFileSelect"
                                id="up_file"
                                class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                aria-describedby="up_file_help"
                                type="file"
                                accept="image/png, image/jpeg"
                                :disabled="isFileUploading"
                            >
                            <p id="up_file_help" class="mt-1 text-sm text-gray-500">PNG, JPG(MAX. 5MB).</p>
                            <p v-if="fileUploadError" class="mt-2 text-sm text-red-800">
                                {{ fileUploadError }}
                            </p>
                            <p v-if="createPinForm.image_path" class="mt-1 text-sm text-gray-500">
                                {{ createPinForm.image_path }}
                            </p>
                            <input v-model="createPinForm.image_path" type="hidden" name="image_path">
                        </div>
                        <div class="col-span-2" v-if="false">
                            <label for="tags" class="block mb-2 text-sm font-medium text-gray-900 ">
                                Tags
                            </label>
                            <input type="text" name="tags" id="tags" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="tags" disabled maxlength="255">
                        </div>
                        <div class="col-span-2">
                            <fieldset>
                                <legend class="block mb-2 text-sm font-medium text-gray-900">Visibility</legend>
                                <div class="flex">
                                    <div v-for="pinVisibility in pinVisibilities" :key="pinVisibility.id"  class="flex items-center me-4">
                                        <input
                                            v-model="createPinForm.visibility"
                                            :id="pinVisibility.id"
                                            type="radio"
                                            :value="pinVisibility.val"
                                            :checked="pinVisibility.id === 'pin-visibility-private'"
                                            name="visibility"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2">
                                        <label :for="pinVisibility.id" class="ms-2 text-sm font-medium text-gray-900">
                                            {{ pinVisibility.title }}
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <button
                        @click="handleCreatePinSubmit"
                        :disabled="isCreatePinSubmitLoading"
                        type="button"
                        :class="[
                            'text-white inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center',
                            isCreatePinSubmitLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300'
                        ]"
                    >
                        <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Add new pin
                    </button>
                    <div v-if="!loggedIn" class="mt-2 text-sm font-medium text-gray-500">
                        Not logged in?
                        <a href="/login" class="text-blue-700 hover:underline dark:text-blue-500">Pleasr Login Or Create account</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import * as v from 'valibot';
import { useFlowbite } from '~/composables/useFlowbite';
import { ExclamationCircleIcon } from '@heroicons/vue/16/solid'
import {
    MicrophoneIcon,
} from '@heroicons/vue/24/outline'

const { loggedIn } = useUserSession()

onMounted(() => {
  useFlowbite((flowbite) => {
    initFlowbite();
  });
});

interface ApiResponse<T = Record<string, unknown>> {
  code: number;
  data?: T;
  message?: string;
}

interface FileUploadData {
  name: string;
  path: string;
}

type FileUploadResponse = ApiResponse<FileUploadData>

const pinVisibilities = [
  { id: 'pin-visibility-private', title: 'Private', val: PinVisibility.PRIVATE},
  { id: 'pin-visibility-public', title: 'Public', val: PinVisibility.PUBLIC},
]

const pinTagsOptions = ref(["Image", "Tool", "Develop", "AI", "TODO", "Video", "Music", "Game", "Hackathon", "Open Source", "Job", "Money", "SEO", "Blog", "News", "Guide", "Help", "Other", "Tip", "Bank", "Share", "Life", "Shop", "Travel", "Free", "VPN", "Link", "Blog", "English", "RPA", "Code", "AWS", "Google", "Apple", "Microsoft", "Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube", "TikTok", "Reddit", "X", "Discord", "Telegram", "WhatsApp", "Skype", "Zoom", "Slack", "Snapchat", "DNS", "DIY", "Website", "Web", "Logo", "App", "Affiliate marketing", "Ranking", "edu", "gov", "blockchain", "make", "sponsor", "search", "wfh", "wi-fi", "i18n"])

const isRecording = ref(false)
const recordingTime = ref(0)
const mediaStream = ref(null)
const mediaRecorder = ref(null)
const audioChunks = []
const audioUrl = ref(null)
const audioBlob = ref(null)
const uploadAudioError = ref("")
let recordingTimerId = null

const startRecording = async () => {
  createPinForm.audio_path = ""
  isCreatePinSubmitLoading.value = true
  try {
    uploadAudioError.value = ''
    mediaStream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(mediaStream.value)

    audioChunks.length = 0
    mediaRecorder.value.ondataavailable = (e) => {
      audioChunks.push(e.data)
    }

    mediaRecorder.value.onstop = async() => {
      audioBlob.value = new Blob(audioChunks, { type: "audio/webm" })
      if (mediaStream.value) {
        mediaStream.value.getTracks().forEach(track => track.stop())
        mediaStream.value = null
      }
      try {
        const formData = new FormData()
        formData.append('audio_file', audioBlob.value)

        const response = await useNuxtApp().$api('/pins/audio', {
          method: 'POST',
          body: formData,
        })

        if (response?.code !== 0) {
            uploadAudioError.value = "Failed to upload audio."
            return false
        }
        uploadAudioError.value = ''
        createPinForm.audio_path = response?.data?.path
        if (createPinForm.content == '' && response?.data?.text) {
            createPinForm.content = response.data.text
        }
      } catch (err) {
        uploadAudioError.value = 'Failed to upload audio.'
      } finally {
        isCreatePinSubmitLoading.value = false
      }
      audioUrl.value = URL.createObjectURL(audioBlob.value)
    }

    mediaRecorder.value.start()
    isRecording.value = true

    recordingTime.value = 0
    recordingTimerId = setInterval(() => {
      recordingTime.value++
      if (recordingTime.value >= 15) {
        stopRecording()
      }
    }, 1000)
  } catch (err) {
    console.error('Recording failed:', err)
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
  }
  isRecording.value = false
  clearInterval(recordingTimerId)
}

const toggleRecording = () => {
  isRecording.value ? stopRecording() : startRecording()
}

const deleteRecording = () => {
  audioUrl.value = null
  recordingTime.value = 0
  uploadAudioError.value = ""
  createPinForm.audio_path = ""
}

const createPinForm = reactive({
  url: '',
  content: '',
  audio_path: '',
  image_path: '',
  visibility: PinVisibility.PRIVATE,
})

const isFileUploading = ref(false)

const FileSchema = v.pipe(
  v.file(),
  v.mimeType(['image/jpeg', 'image/png'], 'Please select a JPEG or PNG file.'),
  v.maxSize(5242880, 'Please select a file smaller than 5 MB.')
)

const fileUploadError = ref('')

async function handleFileSelect(e: Event) {
  if (isFileUploading.value) {
    return
  }

  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  fileUploadError.value = ''
  createPinForm.image_path = ''

  if (!file) {
    return
  }

  try {
    v.parse(FileSchema, file)
  } catch (error) {
    if (error instanceof v.ValiError) {
      fileUploadError.value = error.issues[0]?.message || 'Error.'
    } else {
      fileUploadError.value = 'Error.'
    }
    input.value = ''
    return
  }
  isFileUploading.value = true
  isCreatePinSubmitLoading.value = true

  const formData = new FormData();
  formData.append('up_file', file);

  try {
    const response = await useNuxtApp().$api<FileUploadResponse>('/pins/file', {
      method: 'POST',
      body: formData,
    })

    if (response.code !== 0) {
      fileUploadError.value = "Failed to upload file."
      createPinForm.image_path = ''
      return false
    }

    createPinForm.image_path = response.data?.path
  } catch (error) {
    fileUploadError.value = "Failed to upload file."
    createPinForm.image_path = ''
    return false
  } finally {
    isFileUploading.value = false
    isCreatePinSubmitLoading.value = false
  }
}

const CreatePinSchema = v.pipe(
  v.object({
    url: v.pipe(
      v.string(),
      v.transform((input) => input.trim()),
      v.union([
        v.literal(''),
        v.pipe(v.string(), v.url(), v.maxLength(2048))
      ])
    ),
    content: v.pipe(
      v.string(),
      v.transform((input) => input.trim()),
      v.maxLength(3000),
    ),
    audio_path: v.pipe(
      v.string(),
      v.transform((input) => input.trim()),
    ),
    image_path: v.pipe(
      v.string(),
      v.transform((input) => input.trim()),
    ),
    visibility: v.pipe(
      v.number(),
      v.picklist([PinVisibility.PRIVATE, PinVisibility.PUBLIC]),
    ),
  }),
  v.check(
    (input) => !(input.url.trim() == '' &&  input.content.trim() == '' && input.image_path.trim() == '' && input.audio_path.trim() == ''),
    'Please enter either a URL, Content, or upload an image or audio.'
  )
);

type CreatePinData = v.InferOutput<typeof CreatePinSchema>;

const errors = ref(null)
const isCreatePinSubmitLoading = ref(false)

if (!loggedIn.value) {
  isCreatePinSubmitLoading.value = true
}

async function handleCreatePinSubmit() {
  isFileUploading.value = true
  isCreatePinSubmitLoading.value = true
  errors.value = null

  let validatedData: CreatePinData
  try {
    validatedData = v.parse(CreatePinSchema, {
      url: createPinForm.url,
      content: createPinForm.content,
      audio_path: createPinForm.audio_path,
      image_path: createPinForm.image_path,
      visibility: createPinForm.visibility,
    })
  } catch (error) {
    isFileUploading.value = false
    isCreatePinSubmitLoading.value = false
    if (error instanceof v.ValiError) {
      errors.value = {
        items: error.issues.map(issue => issue.message),
      }
    }
    return
  }

  try {

    const pin = await useNuxtApp().$api('/pins', {
      method: 'POST',
      body: validatedData,
    })

    if (pin?.code !== 0 || !pin?.data) {
      errors.value = {
        msg: 'Failed to create pin. Please try again.',
        items: []
      }
      return
    }

    window.location.href = '/'

  } catch (error) {
    errors.value = {
      msg: 'Failed to create pin. Please try again.',
      items: []
    }
  } finally {
    isFileUploading.value = false
    isCreatePinSubmitLoading.value = false
  }
}
</script>
