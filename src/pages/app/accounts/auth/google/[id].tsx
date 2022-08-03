import { authEmail } from '@/common/api'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SET_SIGN_UP_PARAMETER } from '@/store/reducer/user'

const auth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const url = location.search
    let searchParam = new URLSearchParams(url)

    if (searchParam.has('code')) {
      axios.get(`${authEmail}${searchParam.get('code')}`)
        .then(resp => {
          dispatch({
            type: SET_SIGN_UP_PARAMETER,
            data: {
              email: resp.data.email
            }
          })

          window.close()
        })
        .catch(err => {
          window.close()
        })
    }
  }, [])

  return (
    <div style={ { color: '#e3e3e3' } }>
      이메일 체크...
    </div>
  )
}

export default auth