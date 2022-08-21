import { authEmail } from '@/common/api'
import Loader from '@/components/Loader'
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
    <div style={{ display: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#121212' }}>
      <Loader />
    </div>
  )
}

export default auth