import { defineStore } from 'pinia'
import { request } from '@/utils'
import { useMessageStore } from '@/stores'
import CONSTANTS from '@/CONSTANTS'
import router from '@/router'

const messageStore = useMessageStore()

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    user: {},
    marketplace: null,
    sellerId: null,
  })

  const login = async payload => {
    payload = {
      ...payload,
      GrantType: 'password',
      Scope: 'amazon_data',
      ClientId: 'C0001',
      ClientSecret: 'SECRET0001',
      RedirectUri: 'https://api.eva.guru',
    }

    await request('post', CONSTANTS?.api?.login, payload).then(res => {
      if (res?.Data?.AccessToken) {
        sessionStorage.setItem('token', res.Data.AccessToken)
        sessionStorage.setItem('email', payload.Email)

        router.push({ path: CONSTANTS.routes.dashboard })
      } else {
        messageStore.setError({ error: CONSTANTS?.errors?.users?.loginError })
      }
    })
  }

  const fetchMe = async () => {
    const email = sessionStorage.getItem('email') || ''
    let hasError = false

    if (email) {
      const payload = { email }

      await request('post', CONSTANTS?.api?.me, payload).then(res => {
        if (res?.Data?.user) {
          state.user = res.Data.user

          if (Array.isArray(res.Data.user?.store) && res.Data.user.store.length) {
            const store = res.Data.user.store[0]
            if (store?.storeId) {
              state.marketplace = store.marketplaceName
            }

            if (store?.storeId) {
              state.sellerId = store.storeId
            }
          }
        } else {
          hasError = true
        }
      })
    } else {
      hasError = true
    }

    if (hasError) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('email')
      messageStore.setError({ error: CONSTANTS?.errors?.users?.invalidToken })

      router.push({ path: '/' })
    }
  }

  return {
    ...toRefs(state), // return all properties in state as refs
    fetchMe,
    login,
  }
})
