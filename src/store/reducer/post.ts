import produce from "immer";

import { CategoryType } from "@/common/defines/Category";
import { PostStateType } from "@/common/defines/Store";

export const initialState: PostStateType = {
  mainPost: [],
  fetchedAllPost: false,
  fetchPostLoading: false,
  fetchPostSuccess: false,
  fetchPostError: false,
  addPostLoading: false,
  addPostSuccess: false,
  addPostError: false,
  deletePostLoading: false,
  deletePostSuccess: false,
  deletePostError: false,
  likePostLoading: false,
  likePostSuccess: false,
  likePostError: false,
  unlikePostLoading: false,
  unlikePostSuccess: false,
  unlikePostError: false,
  scrapPostLoading: false,
  scrapPostSuccess: false,
  scrapPostError: false,
  unscrapPostLoading: false,
  unscrapPostSuccess: false,
  unscrapPostError: false,
  fetchCommentLoading: false,
  fetchCommentSuccess: false,
  fetchCommentError: false,
  addCommentLoading: false,
  addCommentSuccess: false,
  addCommentError: false,
  updateCommentLoading: false,
  updateCommentSuccess: false,
  updateCommentError: false,
  deleteCommentLoading: false,
  deleteCommentSuccess: false,
  deleteCommentError: false,
  fetchReplyLoading: false,
  fetchReplySuccess: false,
  fetchReplyError: false,
  addReplyLoading: false,
  addReplySuccess: false,
  addReplyError: false,
  updateReplyLoading: false,
  updateReplySuccess: false,
  updateReplyError: false,
  deleteReplyLoading: false,
  deleteReplySuccess: false,
  deleteReplyError: false,
  pagingNumber: 0,
  pagingSize: 20,
  postCategory: CategoryType.전체,
  displayImagePopup: false,
  popupIamgeArray: [],
  popupImageCurrentIdx: null,
}

export const FETCH_POST_REQUEST = 'FETCH_POST_REQUEST'
export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS'
export const FETCH_POST_FAILURE = 'FETCH_POST_FAILURE'

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST'
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS'
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE'

export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST'
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS'
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE'

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST'
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS'
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE'

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST'
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS'
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE'

export const SCRAP_POST_REQUEST = 'SCRAP_POST_REQUEST'
export const SCRAP_POST_SUCCESS = 'SCRAP_POST_SUCCESS'
export const SCRAP_POST_FAILURE = 'SCRAP_POST_FAILURE'

export const UNSCRAP_POST_REQUEST = 'UNSCRAP_POST_REQUEST'
export const UNSCRAP_POST_SUCCESS = 'UNSCRAP_POST_SUCCESS'
export const UNSCRAP_POST_FAILURE = 'UNSCRAP_POST_FAILURE'

export const FETCH_COMMENT_REQUEST = 'FETCH_COMMENT_REQUEST'
export const FETCH_COMMENT_SUCCESS = 'FETCH_COMMENT_SUCCESS'
export const FETCH_COMMENT_FAILURE = 'FETCH_COMMNET_FAILURE'

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST'
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS'
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE'

export const UPDATE_COMMENT_REQUEST = 'UPDATE_COMMENT_REQUEST'
export const UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS'
export const UPDATE_COMMENT_FAILURE = 'UPDATE_COMMENT_FAILURE'

export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST'
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS'
export const DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE'

export const FETCH_REPLY_REQUEST = 'FETCH_REPLY_REQUEST'
export const FETCH_REPLY_SUCCESS = 'FETCH_REPLY_SUCCESS'
export const FETCH_REPLY_FAILURE = 'FETCH_REPLY_FAILURE'

export const ADD_REPLY_REQUEST = 'ADD_REPLY_REQUEST'
export const ADD_REPLY_SUCCESS = 'ADD_REPLY_SUCCESS'
export const ADD_REPLY_FAILURE = 'ADD_REPLY_FAILURE'

export const UPDATE_REPLY_REQUEST = 'UPDATE_REPLY_REQUEST'
export const UPDATE_REPLY_SUCCESS = 'UPDATE_REPLY_SUCCESS'
export const UPDATE_REPLY_FAILURE = 'UPDATE_REPLY_FAILURE'

export const DELETE_REPLY_REQUEST = 'DELETE_REPLY_REQUEST'
export const DELETE_REPLY_SUCCESS = 'DELETE_REPLY_SUCCESS'
export const DELETE_REPLY_FAILURE = 'DELETE_REPLY_FAILURE'

export const CHANGE_POST_CATEGORY = 'CHANGE_POST_CATEGORY'
export const CHANGE_POPUP_IMAGES = 'CHANGE_POPUP_IMAGES'
export const TOGGLE_POPUP_DISPLAY = 'TOGGLE_POPUP_DISPLAY'

export const addPost = data => ({
  type: ADD_POST_REQUEST,
  data,
})

export const changePostCategory = data => ({
  type: CHANGE_POST_CATEGORY,
  data,
})

export const changePopupImages = data => ({
  type: CHANGE_POPUP_IMAGES,
  data,
})

export const togglePopupDisplay = () => ({
  type: TOGGLE_POPUP_DISPLAY
})

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case FETCH_POST_REQUEST:
        draft.fetchPostLoading = true
        draft.fetchPostSuccess = false
        draft.fetchPostError = null

        draft.mainPost = []

        break
      case FETCH_POST_SUCCESS:
        draft.fetchPostLoading = false
        draft.fetchPostSuccess = true

        if (action.data.post.length === 0) debugger

        if (action.data.initPost) draft.mainPost = action.data.post
        else draft.mainPost = action.data.post.concat(draft.mainPost)
        
        break
      case FETCH_POST_FAILURE:
        draft.fetchPostLoading = false
        draft.fetchPostSuccess = false
        draft.fetchPostError = action.data
        
        break
      case ADD_POST_REQUEST:
        draft.addPostLoading = true
        draft.addPostSuccess = false
        draft.addPostError = null

        break
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false
        draft.addPostSuccess = true
        draft.mainPost = action.data
        
        break
      case ADD_POST_FAILURE:
        draft.addPostLoading = false
        draft.addPostSuccess = false
        draft.addPostError = action.error
        
        break
      case DELETE_POST_REQUEST:
        draft.deletePostLoading = true
        draft.deletePostSuccess = false
        draft.deletePostError = null

        break
      case DELETE_POST_SUCCESS:
        draft.deletePostLoading = false
        draft.deletePostSuccess = true
        draft.mainPost = draft.mainPost.filter((v) => v.id !== action.data)
        
        break
      case DELETE_POST_FAILURE:
        draft.deletePostLoading = false
        draft.deletePostSuccess = false
        draft.deletePostError = action.error
        
        break
      case LIKE_POST_REQUEST:
        draft.likePostLoading = true
        draft.likePostSuccess = false
        draft.likePostError = null

        break
      case LIKE_POST_SUCCESS: {
        switch (action.data.type) {
          case "post": {
            const post = action.data.extraPost || draft.mainPost.find((v) => v.id === action.data)

            post.like_count += 1
            post.like_yn = 'Y'

            break
          }
          case "comment": {
            const post = action.data.extraPost || draft.mainPost.find((v) => v.id === action.data.postId)
            const comment = post.comment_list.find(v => v.id === action.data.id)

            comment.like_count += 1
            comment.like_yn = 'Y'

            break
          }
          case "reply": {
            const post = draft.mainPost.find((v) => v.id === action.data.postId)
            const comment = post.comment_list.find(v => v.id === action.data.commentId)
            const reply = comment.reply_list.find(v => v.id === action.data.id)

            reply.like_count += 1
            reply.like_yn = 'Y'

            break
          }
        }
        draft.likePostLoading = false
        draft.likePostSuccess = true
        
        break
      }
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false
        draft.likePostSuccess = false
        draft.likePostError = action.error
        
        break
      case UNLIKE_POST_REQUEST:
        draft.unlikePostLoading = true
        draft.unlikePostSuccess = false
        draft.unlikePostError = null

        break
      case UNLIKE_POST_SUCCESS: {
        switch (action.data.contents_type) {
          case "post": {
            const post = action.data.extraPost || draft.mainPost.find((v) => v.id === action.data)

            post.like_count -= 1
            post.like_yn = 'N'

            break
          }
          case "comment": {
            const post = draft.mainPost.find((v) => v.id === action.data.postId)
            const comment = post.comment_list.find(v => v.id === action.data.id)

            comment.like_count -= 1
            comment.like_yn = 'N'

            break
          }
          case "reply": {
            const post = draft.mainPost.find((v) => v.id === action.data.postId)
            const comment = post.comment_list.find(v => v.id === action.data.commentId)
            const reply = comment.reply_list.find(v => v.id === action.data.id)

            reply.like_count -= 1
            reply.like_yn = 'N'

            break
          }
        }

        draft.unlikePostLoading = false
        draft.unlikePostSuccess = true
        
        break
      }
      case UNLIKE_POST_FAILURE:
        draft.unlikePostLoading = false
        draft.unlikePostSuccess = false
        draft.unlikePostError = action.error
        
        break
      case SCRAP_POST_REQUEST:
        draft.scrapPostLoading = true
        draft.scrapPostSuccess = false
        draft.scrapPostError = null

        break
      case SCRAP_POST_SUCCESS: {
        const post = draft.mainPost.find((v) => v.id === action.data)

        post.scrap_yn = 'Y'
        draft.scrapPostLoading = false
        draft.scrapPostSuccess = true
        
        break
      }
      case SCRAP_POST_FAILURE:
        draft.scrapPostLoading = false
        draft.scrapPostSuccess = false
        draft.scrapPostError = action.error
        
        break
      case UNSCRAP_POST_REQUEST:
        draft.unscrapPostLoading = true
        draft.unscrapPostSuccess = false
        draft.unscrapPostError = null

        break
      case UNSCRAP_POST_SUCCESS: {
        const post = draft.mainPost.find((v) => v.id === action.data)

        post.scrap_yn = 'N'
        draft.unscrapPostLoading = false
        draft.unscrapPostSuccess = true
        
        break
      }
      case UNSCRAP_POST_FAILURE:
        draft.unscrapPostLoading = false
        draft.unscrapPostSuccess = false
        draft.unscrapPostError = action.error
        
        break
      case FETCH_COMMENT_REQUEST:
        draft.fetchCommentLoading = true
        draft.fetchCommentSuccess = false
        draft.fetchCommentError = null

        break
      case FETCH_COMMENT_SUCCESS: {
        const post = draft.mainPost.find(v => v.id === action.data.id)
        if (post.comment_list) post.comment_list.push(action.data.list)
        else post.comment_list = action.data.list

        action.data.extraAction()

        draft.fetchCommentLoading = false
        draft.fetchCommentSuccess = true

        break
      }
      case FETCH_COMMENT_FAILURE:
        draft.addCommentLoading = false
        draft.addCommentSuccess = false
        draft.addCommentError = action.error
        
        break
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = false
        draft.addCommentSuccess = false
        draft.addCommentError = action.error
        
        break
      case ADD_COMMENT_SUCCESS:
        const post = draft.mainPost.find(v => v.id === action.data.id)
        
        post.comment_list = action.data.list
        post.comment_count += 1
        
        draft.addCommentLoading = false
        draft.addCommentSuccess = true

        if (action.data.onSuccess) action.data.onSuccess()

        break
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false
        draft.addCommentSuccess = false
        draft.addCommentError = action.error

        break
      case UPDATE_COMMENT_REQUEST:
        draft.updateCommentLoading = true
        draft.updateCommentSuccess = false
        draft.updateCommentError = null

        break
      case UPDATE_COMMENT_SUCCESS: {
        const post = draft.mainPost.find((v) => v.id === action.data.postId)
        const comment = post.comment_list.find((v) => v.id === action.data.id)

        comment.contents = action.data.contents
        
        draft.updateCommentLoading = false
        draft.updateCommentSuccess = true

        break
      }
      case UPDATE_COMMENT_FAILURE:
        draft.updateCommentLoading = false
        draft.updateCommentSuccess = false
        draft.updateCommentError = action.error

        break
      case DELETE_COMMENT_REQUEST:
        draft.deleteCommentLoading = true
        draft.deleteCommentSuccess = false
        draft.deleteCommentError = null

        break
      case DELETE_COMMENT_SUCCESS: {
        const post = draft.mainPost.find((v) => v.id === action.data.postId)

        post.comment_list = post.comment_list.filter(item => item.id !== action.data.id)
        post.comment_count -= 1

        draft.deleteCommentLoading = false
        draft.deleteCommentSuccess = true

        if (action.data.onSuccess) action.data.onSuccess()

        break
      }
      case DELETE_COMMENT_FAILURE:
        draft.deletePostLoading = false
        draft.deleteCommentSuccess = false
        draft.deleteCommentError = action.error

        break
      case FETCH_REPLY_REQUEST:
        draft.fetchReplyLoading = true
        draft.fetchReplySuccess = false
        draft.fetchReplyError = null

        break
      case FETCH_REPLY_SUCCESS: {
        const post = draft.mainPost.find(v => v.id === action.data.postId)
        const comment = post.comment_list.find(v => v.id === action.data.commentId)

        comment.reply_list 
          ? comment.reply_list.push(...action.data.list)
          : comment.reply_list = action.data.list
        draft.fetchReplyLoading = false
        draft.fetchReplySuccess = true

        break
      }
      case FETCH_REPLY_FAILURE:
        draft.fetchReplyLoading = false
        draft.fetchReplyError = action.error

        break
      case ADD_REPLY_REQUEST:
        draft.addReplyLoading = true
        draft.addReplySuccess = false
        draft.addReplyError = null

        break
      case ADD_REPLY_SUCCESS: {
        const post = draft.mainPost.find(v => v.id === action.data.postId)
        const comment = post.comment_list.find(v => v.id === action.data.commentId)

        comment.reply_list = action.data.list
        comment.reply_count += 1
        draft.addReplyLoading = false
        draft.addReplySuccess = true

        if (action.data.onSuccess) action.data.onSuccess()
        
        break
      }
      case ADD_REPLY_FAILURE:
        draft.addReplyLoading = false
        draft.addReplyError = action.error

        break
      case UPDATE_REPLY_REQUEST:
        draft.updateReplyLoading = true
        draft.updateReplySuccess = false
        draft.updateReplyError = null

        break
      case UPDATE_REPLY_SUCCESS: {
        const post = draft.mainPost.find(v => v.id === action.data.postId)
        const comment = post.comment_list.find(v => v.id === action.data.commentId)
        const reply = comment.reply_list.find(v => v.id === action.data.id)

        reply.contents = action.data.contents
        draft.updateReplyLoading = false
        draft.updateReplySuccess = true

        if (action.data.onSuccess) action.data.onSuccess()
        break
      }
      case UPDATE_REPLY_FAILURE:
        draft.updateReplyLoading = false
        draft.updateReplyError = action.error

        break
      case DELETE_REPLY_REQUEST:
        draft.deleteReplyLoading = true
        draft.deleteReplySuccess = false
        draft.deleteReplyError = null

        break
      case DELETE_REPLY_SUCCESS: {
        const post = draft.mainPost.find(v => v.id === action.data.postId)
        const comment = post.comment_list.find(v => v.id === action.data.commentId)
        
        comment.reply_count -= 1
        comment.reply_list = comment.reply_list.filter(v => v.id !== action.data.id)
        draft.deleteReplyLoading = false
        draft.deleteReplySuccess = true

        if (action.data.onSuccess) action.data.onSuccess()
        break
      }
      case DELETE_REPLY_FAILURE:
        draft.deleteReplyLoading = false
        draft.deleteReplyError = action.error

        break
      case CHANGE_POST_CATEGORY:
        draft.postCategory = action.data
        break
      case CHANGE_POPUP_IMAGES:
        draft.popupIamgeArray = action.data.images
        draft.popupImageCurrentIdx = action.data.idx
        draft.displayImagePopup = !draft.displayImagePopup

        break
      case TOGGLE_POPUP_DISPLAY:
        draft.displayImagePopup = !draft.displayImagePopup
        break
      default:
        break
    }
  })
}

export default reducer