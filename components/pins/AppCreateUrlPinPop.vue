<template>
  <Teleport to="body">
  <div
    v-show="isOpen"
    ref="floatingEl"
    :style="floatingStyles"
    class="z-20 p-4"
  >
        <form method="post">
            <label for="url" class="sr-only">Link</label>
            <div class="relative">
              <input
                id="url" 
                ref="inputRef"
                v-model="url"
                type="url" 
                placeholder="Enter Link"
                class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                required
                maxlength="2048"
              >
              <button
                type="button"
                :class="[
                  'text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2',
                  isCreateLonding ? 'cursor-progress' : 'cursor-pointer'
                ]"
                :disabled="isCreateLonding"
                @click="handleCreateUrlPin"
              >
                {{ isCreateLonding ? 'Create...' : 'Create' }}
              </button>
            </div>
        </form>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'

const props = defineProps<{
  isOpen: boolean
  referenceEl: null
}>()

const emit = defineEmits(['pin-created', 'close'])

const isCreateLonding = ref(false) 
const url = ref('')
const floatingEl = ref(null)
const inputRef = ref<HTMLInputElement | null>(null)

const referenceEl = computed(() => props.referenceEl || undefined)

const { floatingStyles, placement, update } = useFloating(
  referenceEl,
  floatingEl,
  {
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
    strategy: 'fixed'
  }
)

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      await nextTick()
      update()
      inputRef.value?.focus()
    } else {
      url.value = ''
    }
  }
)

const handleCreateUrlPin = async () => {
  if (!url.value) {
    return
  }

  isCreateLonding.value = true
  try {
    /*
    const response = await creatUrlPin(url.value)
    if (response && response.code === 0 && response.data) {
      emit('pin-created', response.data)
    }
      */
      url.value = ''
      emit('close')
      isCreateLonding.value = false
  } catch (error) {
    isCreateLonding.value = false
    console.error('Error creating URL pin:', error)
  }
}
</script>