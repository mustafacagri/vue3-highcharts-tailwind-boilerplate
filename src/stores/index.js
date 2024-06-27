import { defineStore } from "pinia";
export * from "./all"; // it will be an easy way to use stores like => import { useConfig, useUser } from '@/stores'

export const useMainStore = defineStore("main", {
  state: () => reactive({}),
  getters: {},
  actions: {},
});
