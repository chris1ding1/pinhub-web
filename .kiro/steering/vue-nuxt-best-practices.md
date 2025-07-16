---
inclusion: always
---

# Vue3 + Nuxt3 Best Practices

## Tech Stack Requirements
- Vue 3 Composition API (prefer `<script setup lang="ts">`)
- Nuxt 3 latest stable version
- TypeScript strict mode
- Follow official Vue 3 and Nuxt 3 best practices

## Code Standards
- Use Composition API over Options API
- Prefer `ref()` and `reactive()` for reactive data
- Use `computed()` for computed properties
- Component naming: PascalCase
- Use TypeScript type annotations

## Performance Optimization
- Proper use of `v-memo` and `v-once`
- Avoid unnecessary reactive data
- Use `shallowRef` and `shallowReactive` when appropriate
- Component lazy loading and code splitting

## Security
- Input validation and sanitization
- XSS protection
- CSRF protection
- No sensitive data exposure on client-side
