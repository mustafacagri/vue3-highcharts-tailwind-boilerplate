import { format } from 'date-fns'

export const dateWithDay = dateString => {
  let response = ''

  if (dateString) {
    try {
      const date = new Date(dateString)
      response = format(date, 'EEEE, MM-dd-yyyy')
    } catch (error) {
      console.log(error)
    }
  }

  return response
}
