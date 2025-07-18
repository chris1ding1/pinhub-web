<template>
    <div class="fixed transform -translate-x-1/2 left-1/2 bottom-10 z-20">
        <div class="flex justify-center items-center p-3 rounded-2xl bg-white/50 shadow-md backdrop-blur-md space-x-1">
            <button
                @click="triggerImage"
                class="w-8 h-8 rounded-lg hover:bg-gray-100 p-1"
                data-tooltip-target="tooltip-image"
            >
                <Icon name="app-icons:catppuccin-image" />
                <input
                    ref="imageInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    class="sr-only"
                    @change="handleImage"
                >
            </button>
            <button
                class="w-8 h-8 rounded-lg hover:bg-gray-100 p-1"
                @click="openPinsCreateDrawer"
            >
              <Icon name="app-icons:plus" />
            </button>
            <button
                ref="urlBtnRef"
                class="w-8 h-8 rounded-lg hover:bg-gray-100 p-1"
                @click="toggleUrlPop"
            >
              <Icon name="app-icons:link" />
            </button>
            <button
              ref="textBtnRef"
              class="w-8 h-8 rounded-lg hover:bg-gray-100 p-1"
              @click="toggleTextPop"
            >
              <Icon name="app-icons:document-text" />
            </button>
        </div>
        <div>
            <div id="tooltip-image" role="tooltip" class="absolute z-20 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-md opacity-0 tooltip min-w-max text-center">
            Image (PNG, JPG up to 5MB)
            </div>
        </div>
        <PinsAppCreateDrawer ref="pinsCreateDrawerRef" @pin-created="handlePinCreated" />
        <PinsAppCreateUrlPinPop
          :is-open="isUrlPopOpen"
          :reference-el="urlBtnRef"
          @close="isUrlPopOpen = false"
          @pin-created="handlePinCreated" 
        />
        <PinsAppCreateTextPinPop
          :is-open="isTextPopOpen"
          :reference-el="textBtnRef"
          @close="isTextPopOpen = false"
          @pin-created="handlePinCreated" 
        />
    </div>
</template>
<script setup lang="ts">
import { useFlowbite } from '~/composables/useFlowbite';
import { initTooltips } from 'flowbite';

const isUrlPopOpen = ref(false)
const urlBtnRef = ref(null)

const isTextPopOpen = ref(false)
const textBtnRef = ref(null)

const pinsCreateDrawerRef = ref(null)

onMounted(() => {
    useFlowbite(() => {
        initTooltips();
    })
})

const emit = defineEmits(['pinCreated'])

const imageInput = ref<HTMLInputElement | null>(null)
const triggerImage = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

const handleImage = async(e: Event) => {
  const eTarget = e.target as HTMLInputElement
  const file = eTarget.files?.[0]

  if (!file) {
    return
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await useNuxtApp().$api<ApiResponse<PinResponse>>('/pins/image', {
      method: 'POST',
      body: formData,
    })

    if (response.code !== 0) {
      return false
    }
    if (response.data) {
      emit('pinCreated', response.data)
    }
  } catch (error) {
    alert(error)
    return false
  }
}

const handlePinCreated = (newPin) => {
  emit('pinCreated', newPin)
}

const openPinsCreateDrawer = () => {
  pinsCreateDrawerRef.value?.openModal()
}

const toggleUrlPop = () => {
  isUrlPopOpen.value = !isUrlPopOpen.value
}

const toggleTextPop = () => {
  isTextPopOpen.value = !isTextPopOpen.value
}
</script>
