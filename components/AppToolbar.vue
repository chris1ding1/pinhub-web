<template>
    <div class="mx-auto max-w-7xl p-3 rounded-2xl bg-white shadow-md left-1/2 fixed bottom-10 justify-center items-center z-20">
        <div class="flex items-center space-x-1">
            <button
                @click="triggerImage"
                class="w-8 h-8 rounded-lg hover:bg-gray-100 p-1 flex justify-center items-center" data-tooltip-target="tooltip-image">
                <Icon
                    class="w-8 h-8"
                    name="app-icons:catppuccin-image"
                />
                <input
                    ref="imageInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    class="sr-only"
                    @change="handleImage"
                >
            </button>
            <button
                class="w-8 h-8 rounded-lg hover:bg-gray-100 p-1 flex justify-center items-center"
                @click="openPinsCreateDrawer"
            >
              <Icon name="heroicons:plus" class="w-6 h-6" />
            </button>
        </div>
        <div>
            <div id="tooltip-image" role="tooltip" class="absolute z-20 invisible inline-block px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-md opacity-0 tooltip min-w-max text-center">
            Image (PNG, JPG up to 5MB)
            </div>
        </div>
        <PinsAppCreateDrawer ref="pinsCreateDrawerRef" @pin-created="handlePinCreated" />
    </div>
</template>
<script setup lang="js">
import { useFlowbite } from '~/composables/useFlowbite';

const pinsCreateDrawerRef = ref(null)

onMounted(() => {
    useFlowbite(() => {
        initTooltips();
    })
})

const emit = defineEmits(['pinCreated'])

const imageInput = ref(null)
const triggerImage = () => {
    imageInput.value.click()
}

const handleImage = async(e) => {
  const file = e.target.files?.[0]

  if (!file) {
    return
  }
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await useNuxtApp().$api('/pins/image', {
      method: 'POST',
      body: formData,
    })

    if (response.code !== 0) {
      alert(error)
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
</script>
