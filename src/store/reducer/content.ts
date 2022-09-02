import produce from 'immer';

import { ContentStateType } from '@/common/defines/Store';

export const initialState: ContentStateType = {
  fetchCreatorLoading: false,
  fetchCreatorSuccess: false,
  fetchCreatorError: false,
  fetchVideoLoading: false,
  fetchVideoSuccess: false,
  fetchVideoError: false,
  creatorList: [],
  videoList: [],
}

export const FETCH_CREATOR_REQUEST = 'FETCH_CREATOR_REQUEST'
export const FETCH_CREATOR_SUCCESS = 'FETCH_CREATOR_SUCCESS'
export const FETCH_CREATOR_FAILURE = 'FETCH_CREATOR_FAILURE'

export const FETCH_VIDEO_REQUEST = 'FETCH_VIDEO_REQUEST'
export const FETCH_VIDEO_SUCCESS = 'FETCH_VIDEO_SUCCESS'
export const FETCH_VIDEO_FAILURE = 'FETCH_VIDEO_FAILURE'

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case FETCH_CREATOR_REQUEST:
      draft.fetchCreatorLoading = true
      draft.fetchCreatorSuccess = false
      draft.fetchCreatorError = null

      break
    case FETCH_CREATOR_SUCCESS:
      draft.fetchCreatorLoading = false
      draft.fetchCreatorSuccess = true

      if (action.data.id)
        draft.creatorList.push(...action.data.list)
      else
        draft.creatorList = action.data.list

      break
    case FETCH_CREATOR_FAILURE:
      draft.fetchCreatorLoading = false
      draft.fetchCreatorError = action.error

      break
    case FETCH_VIDEO_REQUEST:
      draft.fetchVideoLoading = true
      draft.fetchVideoSuccess = false
      draft.fetchVideoError = null

      break
    case FETCH_VIDEO_SUCCESS:
      draft.fetchVideoLoading = false
      draft.fetchVideoSuccess = true
      draft.videoList = [ ...action.data.list ]
      break
    case FETCH_VIDEO_FAILURE:
      draft.fetchVideoLoading = false
      draft.fetchVideoError = action.error

      break
    default:
      return state
  }
})

export default reducer