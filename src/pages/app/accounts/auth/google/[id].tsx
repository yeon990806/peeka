import { authEmail } from '@/common/api'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SET_SIGN_UP_PARAMETER, SIGN_UP_REQUEST } from '@/store/reducer/user'

const auth = () => {
  const dispatch = useDispatch()

  const getGoogleEmail = async (authCode) => {
    try {
      const result = await axios.get(`${authEmail}${authCode}`)

      if (result.data.id)
        dispatch({
          type: SIGN_UP_REQUEST,
          data: result.data,
        })
      else
        dispatch({
          type: SET_SIGN_UP_PARAMETER,
          data: {
            email: result.data.email
          }
        })
      debugger;
      window.close()
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
      이메일 체크...
    </div>
  )
}

export default auth