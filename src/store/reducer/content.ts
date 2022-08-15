import produce from 'immer';

import { ContentStateType } from '@/common/defines/Store';

export const initialState: ContentStateType = {
  fetchCuratorLoading: false,
  fetchCuratorSuccess: false,
  fetchCuratorError: false,
  fetchVideoLoading: false,
  fetchVideoSuccess: false,
  fetchVideoError: false,
  curatorList: [],
  videoList: []
}

export const FETCH_CURATOR_REQUEST = 'FETCH_CURATOR_REQUEST'
export const FETCH_CURATOR_SUCCESS = 'FETCH_CURATOR_SUCCESS'
export const FETCH_CURATOR_FAILURE = 'FETCH_CURATOR_FAILURE'

export const FETCH_VIDEO_REQUEST = 'FETCH_VIDEO_REQUEST'
export const FETCH_VIDEO_SUCCESS = 'FETCH_VIDEO_SUCCESS'
export const FETCH_VIDEO_FAILURE = 'FETCH_VIDEO_FAILURE'

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case FETCH_CURATOR_REQUEST:
      draft.fetchCuratorLoading = true
      draft.fetchCuratorSuccess = false
      draft.fetchCuratorError = null

      break
    case FETCH_CURATOR_SUCCESS:
      draft.fetchCuratorLoading = false
      draft.fetchCuratorSuccess = true

      if (action.data.id)
        draft.curatorList.push(...action.data.list)
      else
        draft.curatorList = action.data.list

      break
    case FETCH_CURATOR_FAILURE:
      draft.fetchCuratorLoading = false
      draft.fetchCuratorError = action.error

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