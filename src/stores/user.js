import { defineStore } from 'pinia'
import { request } from '@/utils'
import { useMessageStore, useSalesStore } from '@/stores'
import CONSTANTS from '@/CONSTANTS'
import router from '@/router'
import validator from 'validator'

export const useUserStore = defineStore('user', () => {
  const messageStore = useMessageStore()
  const salesStore = useSalesStore()

  const state = reactive({
    user: {},
    marketplace: null,
    sellerId: null,
  })

  const login = async payload => {
    let response = false

    if (!validator.isEmail(payload?.Email)) {
      messageStore.setError({ error: CONSTANTS?.errors?.users?.email })

      return response
    } else if (!validator.isLength(payload?.Password, { min: CONSTANTS?.password?.minLength })) {
      messageStore.setError({ error: CONSTANTS?.errors?.users?.password })

      return response
    }

    const loginPayload = {
      ...payload,
      GrantType: 'password',
      Scope: 'amazon_data',
      ClientId: 'C0001',
      ClientSecret: 'SECRET0001',
      RedirectUri: 'https://api.eva.guru',
    }

    try {
      const res = await request('post', CONSTANTS?.api?.login, loginPayload)

      if (res?.Data?.AccessToken) {
        sessionStorage.setItem('token', res.Data.AccessToken)
        sessionStorage.setItem('email', payload.Email)
        response = true
      } else {
        messageStore.setError({ error: CONSTANTS?.errors?.users?.loginError })
      }
    } catch (error) {
      messageStore.setError({ error: CONSTANTS?.errors?.users?.loginError })
    }

    return response
  }

  const fetchMe = async () => {
    salesStore.dailySalesOverview = []
    const email = sessionStorage.getItem('email') || ''
    let hasError = true

    if (email) {
      const payload = { email }

      try {
        const res = await request('post', CONSTANTS?.api?.me, payload)
        if (res?.Data?.user) {
          state.user = res.Data.user

          const store = res.Data.user?.store?.[0]

          if (store?.marketplaceName && store?.storeId) {
            state.marketplace = store.marketplaceName
            state.sellerId = store.storeId
            hasError = false

            await salesStore.fetchDailySalesOverview()
          }
        }
      } catch (error) {}
    }

    if (hasError) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('email')
      messageStore.setError({ error: CONSTANTS?.errors?.users?.userData })
      router.push({ path: '/' })
    }
  }

  return {
    ...toRefs(state), // return all properties in state as refs
    fetchMe,
    login,
  }
})
