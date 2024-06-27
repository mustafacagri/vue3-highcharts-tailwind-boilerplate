import axios from 'axios'
import CONSTANTS from '@/CONSTANTS'
import { useMessageStore } from '@/stores'

const request = async (type, pureUrl, params = {}, time = null) => {
  pureUrl ??= '' // if pureUrl is undefined, set it to an empty string

  const checkResponse = async data => {
    return data
      .then(res => {
        if (!res?.data) {
          useMessageStore().setErrorClear({ error: 'Server Error' })
        } else {
          const { ApiStatusMessage: message } = res.data

          if (res?.data?.ApiStatus !== 200) {
            useMessageStore().setErrorClear({ error: message, time })
          } else if (res.data) {
            useMessageStore().setIsSuccess({ message, time })
          } else {
            useMessageStore().setErrorClear({ error: message, time })
          }

          return res.data
        }
      })
      .catch(error => {
        error = error?.response?.data?.ApiStatusMessage || 'Server Error'

        useMessageStore().setError({ error })
      })
  }

  const baseUrl = import.meta.env.VITE_OPENAI_API_BASEURL || ''
  const url = baseUrl.endsWith('/') ? baseUrl + pureUrl : baseUrl + '/' + pureUrl
  const token = sessionStorage.getItem('token')
  let contentType = 'application/json'

  const potentialFiles = ['image', 'image', 'file', 'files']
  const foundPropertyInParams = potentialFiles.find(item => Object.prototype.hasOwnProperty.call(params, item))

  if (foundPropertyInParams && !!params[foundPropertyInParams]) {
    contentType = 'multipart/form-data'
  }

  const headers = {
    Authorization: 'Bearer ' + token,
    'content-type': contentType,
  }

  const withCredentials = false

  let options = {
    params,
    headers,
    withCredentials,
  }

  const response = ['get', 'delete'].includes(type)
    ? axios[type](url, options)
    : axios[type](url, params, { headers, withCredentials })

  const checkedResponse = await checkResponse(response)
  if (checkedResponse) {
    // we do not return anything if the request failed since we already used useMessageStore().setError

    return checkedResponse
  }
}

export { request }
