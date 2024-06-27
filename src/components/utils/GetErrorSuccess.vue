<script setup>
import { useMessageStore } from "@/stores";
import { useI18n } from "vue-i18n";

const messageStore = useMessageStore();
const { t, te } = useI18n();

const error = computed(() =>
  te(messageStore?.getError)
    ? t(messageStore?.getError)
    : messageStore?.getError
);
const success = computed(() =>
  te(messageStore?.getIsSuccess)
    ? t(messageStore?.getIsSuccess)
    : messageStore?.getIsSuccess
);
</script>

<template>
  <div
    v-if="error"
    class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
  >
    {{ error }}
  </div>

  <div
    v-else-if="success"
    class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded"
  >
    {{ success }}
  </div>
</template>
