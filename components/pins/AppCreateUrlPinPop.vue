<template>
  <Teleport to="body">
  <div
    v-show="isOpen"
    ref="floatingEl"
    :style="floatingStyles"
    class="z-20 p-4 w-full max-w-sm"
  >
        <form method="post" class="mx-auto w-full max-w-md">
            <label for="url" class="sr-only">Link</label>
            <div class="relative">
              <input
                id="url"
                ref="inputRef"
                v-model="url"
                type="url"
                placeholder="Enter Link"
                class="block w-full p-4 text-sm text-gray-900 border rounded-lg bg-white/50 shadow-md backdrop-blur-md focus:ring-blue-500 focus:border-blue-500" 
                required
                maxlength="2048"
                @keydown.esc="handleEsc"
              >
              <button
                type="button"
                :class="[
                  'text-white absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2',
                  isCreateLonding ? 'cursor-progress bg-blue-400' : 'cursor-pointer bg-blue-700 hover:bg-blue-800'
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
import * as v from 'valibot';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'

const props = defineProps<{
  isOpen: boolean
  referenceEl: HTMLElement | null
}>()

const emit = defineEmits(['pin-created', 'close'])

const isCreateLonding = ref(false) 
const url = ref('')
const floatingEl = ref(null)
const inputRef = ref<HTMLInputElement | null>(null)

const referenceEl = computed(() => props.referenceEl || undefined)

const { floatingStyles, update } = useFloating(
  referenceEl,
  floatingEl,
  {
    placement: 'top',
    middleware: [
      offset(10),
      flip(),
      shift()
    ],
    whileElementsMounted: autoUpdate,
    strategy: 'fixed'
  }
)

onClickOutside(floatingEl, (event) => {
  const target = event.target as Node;

  if (props.isOpen && referenceEl.value && !referenceEl.value.contains(target)) {
    emit('close')
  }
})

// Handle ESC key
const handleEsc = () => {
  emit('close')
}

// Also listen for ESC globally when component is open
onKeyStroke('Escape', () => {
  if (props.isOpen) {
    emit('close')
  }
})

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

  try {
    v.parse(ValidatorPinUrlSchema, url.value)
  } catch (error) {
    console.log('Create url pin verify error: ', error)

    if (error instanceof v.ValiError) {
      const flatErrors = v.flatten(error.issues)
      console.log('Create url pin verify error: ', flatErrors)
    }

    return
  }

  isCreateLonding.value = true
  try {
    const response = await createUrlPin(url.value)

    if (!response || response.code !== 0 || !response.data) {
      return
    }
    
    emit('pin-created', response.data)
    url.value = ''
    emit('close')
    
  } catch (error) {
    console.error('Error creating URL pin:', error)
  } finally {
    isCreateLonding.value = false
  }
}
</script>