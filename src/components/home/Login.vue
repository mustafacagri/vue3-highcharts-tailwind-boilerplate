<script setup>
import { useUserStore } from '@/stores'
const userStore = useUserStore()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  const payload = { Email: email.value, Password: password.value }
  userStore.login(payload)
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
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
          v-model="email"
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
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
          v-model="password"
          type="password"
        />
      </div>
      <button class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
        Login
      </button>
    </form>
  </div>
</template>
