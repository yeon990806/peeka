import { HYDRATE } from 'next-redux-wrapper'
import { combineReducers } from 'redux';

import user from './user'
import post from './post'
import content from './content'
import extra from './extra'
import comment from './comment'
import reply from './reply'
import reaction from './reaction'

const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        return { state, ...action.payload }
      default:
        return state
    }
  },
  user,
  post,
  content,
  extra,
  comment,
  reply,
  reaction,
})

export default rootReducer