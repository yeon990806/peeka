import { authEmail } from '@/common/api'
import axios from 'axios'
import { useEffect } from 'react'

const auth = () => {

  const getGoogleEmail = async (authCode) => {
    try {
      const result = await axios.get(`${authEmail}${authCode}`)

      if (result.data.id) {
        if (window.opener.afterAction) window.opener.afterAction('signin', result.data)
        window.close()
      }
      else {
        if (window.opener.afterAction) window.opener.afterAction('signup', result.data)
        window.close()
      }
    } catch (err) {
      window.close()
    }
  }

  useEffect(() => {
    const url = location.search
    let searchParam = new URLSearchParams(url)

    getGoogleEmail(searchParam.get('code'))
  }, [])

  return (
    <div style={ { color: '#e3e3e3' } }>
      이메일 체크... google
    </div>
  )
}

export default auth