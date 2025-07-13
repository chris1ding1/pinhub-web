<template>
    <footer class="bg-white mt-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="py-16">
                <nav class="mt-10 text-sm" aria-label="quick links">
                    <div class="-my-1 flex justify-center gap-x-6">
                        <a class="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/pins">
                            Pins
                        </a>
                    </div>
                </nav>
            </div>
            <div class="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
                <div class="flex gap-x-6">
                    <a class="group" aria-label="PinHub on X" v-for="item in socialites" :key="item.name" :href="item.href">
                        <svg
                            class="h-6 w-6 fill-slate-500 group-hover:fill-slate-700" aria-hidden="true"
                            viewBox="0 0 24 24">
                            <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z"></path>
                        </svg>
                    </a>
                </div>
                <p class="mt-6 text-sm text-slate-500 sm:mt-0">
                    Copyright &copy; 2025 PinHub.xyz. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
const socialites = [
{
    name: 'X',
    href: 'https://x.com/chris1ding1',
    icon: defineComponent({
      render: () =>
        h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', {
            d: 'M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z',
          }),
        ]),
    }),
  },
]
</script>
