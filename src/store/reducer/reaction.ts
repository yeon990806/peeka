import { likeContentAction } from '@/common/defines/Action';
import { ReactionStateType } from '@/common/defines/Store';
import produce from "immer"

export const initialState: ReactionStateType = {
  likeContentLoading: false,
  likeContentSuccess: false,
  likeContentError: false,
  unlikeContentLoading: false,
  unlikeContentSuccess: false,
  unlikeContentError: false,
  scrapContentLoading: false,
  scrapContentSuccess: false,
  scrapContentError: false,
  unscrapContentLoading: false,
  unscrapContentSuccess: false,
  unscrapContentError: false,
}

export const LIKE_CONTENT_REQUEST = 'LIKE_CONTENT_REQUEST'
export const LIKE_CONTENT_SUCCESS = 'LIKE_CONTENT_SUCCESS'
export const LIKE_CONTENT_FAILURE = 'LIKE_CONTENT_FAILURE'

export const UNLIKE_CONTENT_REQUEST = 'UNLIKE_CONTENT_REQUEST'
export const UNLIKE_CONTENT_SUCCESS = 'UNLIKE_CONTENT_SUCCESS'
export const UNLIKE_CONTENT_FAILURE = 'UNLIKE_CONTENT_FAILURE'

export const SCRAP_CONTENT_REQUEST = 'SCRAP_CONTENT_REQUEST'
export const SCRAP_CONTENT_SUCCESS = 'SCRAP_CONTENT_SUCCESS'
export const SCRAP_CONTENT_FAILURE = 'SCRAP_CONTENT_FAILURE'

export const UNSCRAP_CONTENT_REQUEST = 'UNSCRAP_CONTENT_REQUEST'
export const UNSCRAP_CONTENT_SUCCESS = 'UNSCRAP_CONTENT_SUCCESS'
export const UNSCRAP_CONTENT_FAILURE = 'UNSCRAP_CONTENT_FAILURE'

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LIKE_CONTENT_REQUEST:
        draft.likeContentLoading = true
        draft.likeContentSuccess = false
        draft.likeContentError = null

        break
      case LIKE_CONTENT_SUCCESS:
        draft.likeContentLoading = false
        draft.likeContentSuccess = true

        break
      case LIKE_CONTENT_FAILURE:
        draft.likeContentLoading = false
        draft.likeContentError = action.error

        break
      case UNLIKE_CONTENT_REQUEST:
        draft.unlikeContentLoading = true
        draft.unlikeContentSuccess = false
        draft.unlikeContentError = null

        break
      case UNLIKE_CONTENT_SUCCESS:
        draft.unlikeContentLoading = false
        draft.unlikeContentSuccess = true

        break
      case UNLIKE_CONTENT_FAILURE:
        draft.unlikeContentLoading = false
        draft.unlikeContentError = action.error

        break
      case SCRAP_CONTENT_REQUEST:
        draft.scrapContentLoading = true
        draft.scrapContentSuccess = false
        draft.scrapContentError = null

        break
      case SCRAP_CONTENT_SUCCESS:
        draft.scrapContentLoading = false
        draft.scrapContentSuccess = true

        break
      case SCRAP_CONTENT_FAILURE:
        draft.scrapContentLoading = false
        draft.scrapContentError = action.error

        break
      case UNSCRAP_CONTENT_REQUEST:
        draft.unscrapContentLoading = true
        draft.unscrapContentSuccess = false
        draft.unscrapContentError = null

        break
      case UNSCRAP_CONTENT_SUCCESS:
        draft.unscrapContentLoading = false
        draft.unscrapContentSuccess = false

        break
      case UNSCRAP_CONTENT_FAILURE:
        draft.unscrapContentLoading = false
        draft.unscrapContentError = action.error

        break
      default: 
        return state
    }
  })
}

export default reducer