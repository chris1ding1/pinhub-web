<template>
    <Teleport to="body">
    <div
      v-show="isOpen"
      ref="floatingEl"
      :style="floatingStyles"
      class="z-20 p-4 mx-auto w-full max-w-xl"
    >
      <div class="min-w-0 flex-1">
          <form method="post" class="relative">
              <div>
                <label for="content" class="sr-only">Content</label>
                <textarea 
                  id="content"
                  ref="inputRef"
                  v-model="content"
                  rows="5" 
                  placeholder="Enter content..." 
                  maxlength="3000"
                  required
                  class="block w-full rounded-md bg-white/50 shadow-md backdrop-blur-md text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
                  @keydown.esc="handleEsc"
                />
              </div>
              <div class="absolute inset-x-0 bottom-0 flex justify-end py-2 pr-2 pl-3">
                <div>
                  <button 
                    type="button"
                    :disabled="isCreateLonding"
                    :class="[
                      'inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                      isCreateLonding ? 'cursor-progress bg-blue-400' : 'cursor-pointer bg-blue-600 hover:bg-blue-500'
                    ]"
                    @click="handleCreateContentPin"
                  >
                  {{ isCreateLonding ? 'Create...' : 'Create' }}
                  </button>
                </div>
              </div>
          </form>
      </div>
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
  const content = ref('')
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
        content.value = ''
      }
    }
  )
  
  const handleCreateContentPin = async () => {
    if (!content.value) {
      return
    }
  
    try {
      v.parse(ValidatorPinContentSchema, content.value)
    } catch (error) {
      console.log('Create content pin verify error: ', error)
  
      if (error instanceof v.ValiError) {
        const flatErrors = v.flatten(error.issues)
        console.log('Create content pin verify error: ', flatErrors)
      }
  
      return
    }
  
    isCreateLonding.value = true
    try {
      const response = await createContentPin(content.value)
  
      if (!response || response.code !== 0 || !response.data) {
        return
      }
      
      emit('pin-created', response.data)
      content.value = ''
      emit('close')
      
    } catch (error) {
      console.error('Error creating Content pin:', error)
    } finally {
      isCreateLonding.value = false
    }
  }
  </script>