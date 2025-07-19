<template>
  <Teleport to="body">
  <div
    v-show="isOpen"
    ref="floatingEl"
    :style="floatingStyles"
    class="z-20 p-4 rounded-xl w-64"
  >
        <form class="w-full">
          <div class="flex flex-col space-y-2">
            <label for="url" class="sr-only">Link</label>
            <input 
              id="url" 
              ref="inputRef"
              v-model="url"
              type="url" 
              placeholder="Enter Link" 
              class="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              required
              maxlength="2048"
            >
            <div class="flex justify-end">
              <button
                type="button" 
                :class="[
                  'inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                  isCreateLonding ? 'cursor-progress' : 'cursor-pointer'
                ]"
                :disabled="isCreateLonding"
                @click="handleCreateUrlPin"
              >
                {{ isCreateLonding ? 'Create...' : 'Create' }}
              </button>
            </div>
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