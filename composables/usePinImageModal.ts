export default function () {
    const isOpen = ref(false)
    const imageUrl = ref('')

    const openModal = (url: string) => {
      imageUrl.value = url
      isOpen.value = true
    }

    const closeModal = () => {
      isOpen.value = false
      imageUrl.value = ''
    }

    return {
      isOpen,
      imageUrl,
      openModal,
      closeModal
    }
}
