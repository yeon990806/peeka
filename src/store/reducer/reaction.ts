import { ReactionStateType } from '@/common/defines/Store';
import produce from "immer"

export const initialState: ReactionStateType = {
  toggleLikeLoading: false,
  toggleLikeSuccess: false,
  toggleLikeError: null,
  toggleScrapLoading: false,
  toggleScrapSuccess: false,
  toggleScrapError: null,
}

export const TOGGLE_LIKE_REQUEST = 'TOGGLE_LIKE_REQUEST'
export const TOGGLE_LIKE_SUCCESS = 'TOGGLE_LIKE_SUCCESS'
export const TOGGLE_LIKE_FAILURE = 'TOGGLE_LIKE_FAILURE'
export const TOGGLE_SCRAP_REQUEST = 'TOGGLE_SCRAP_REQUEST'
export const TOGGLE_SCRAP_SUCCESS = 'TOGGLE_SCRAP_SUCCESS'
export const TOGGLE_SCRAP_FAILURE = 'TOGGLE_SCRAP_FAILURE'

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case TOGGLE_LIKE_REQUEST:
        draft.toggleLikeLoading = true
        draft.toggleLikeSuccess = false
        draft.toggleLikeError = null

        break
      case TOGGLE_LIKE_SUCCESS:
        draft.toggleLikeLoading = false
        draft.toggleLikeSuccess = true
        
        break
      case TOGGLE_LIKE_FAILURE:
        draft.toggleLikeLoading = false
        draft.toggleLikeError = action.error

        break
      case TOGGLE_SCRAP_REQUEST:
        draft.toggleScrapLoading = true
        draft.toggleScrapSuccess = false
        draft.toggleScrapError = null

        break
      case TOGGLE_SCRAP_SUCCESS:
        draft.toggleScrapLoading = false
        draft.toggleScrapSuccess = true

        break
      case TOGGLE_SCRAP_FAILURE:
        draft.toggleScrapLoading = false
        draft.toggleScrapError = action.error

        break
      default: 
        return state
    }
  })
}

export default reducer