<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import CONSTANTS from '@/CONSTANTS'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true

  try {
    const payload = { Email: email.value, Password: password.value }
    const res = await userStore.login(payload)
    if (res) {
      await router.push({ path: CONSTANTS.routes.dashboard })
    }
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-lg w-96">
    <GetErrorSuccess />
    <h2 class="text-2xl font-bold mb-5 text-center">Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label
          for="email"
          class="block text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          v-model="email"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          type="email"
          required
        />
      </div>
      <div class="mb-6">
        <label
          for="password"
          class="block text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          v-model="password"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          type="password"
          required
        />
      </div>
      <button
        :disabled="isLoading"
        class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 relative flex items-center justify-center"
      >
        <span v-if="!isLoading">Login</span>
        <svg
          v-if="isLoading"
          class="animate-spin h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </button>
    </form>
  </div>
</template>
