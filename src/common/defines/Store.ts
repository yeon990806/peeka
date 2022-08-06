import { number, string } from "prop-types";
import { CategoryType } from "./Category";

export type StateType = {
  user: UserType,
  post: PostStateType,
  signIn?: {},
  signUp?: {},
  content: ContentStateType,
  extra: ExtraStateType,
}

export type ExtraStateType = {
  extraList: PostType[],
}

export type ContentStateType = {
  fetchCuratorLoading: boolean
  fetchCuratorSuccess: boolean
  fetchCuratorError: any
  fetchVideoLoading: boolean
  fetchVideoSuccess: boolean
  fetchVideoError: any
  curatorList: CuratorType[],
  videoList: VideoType[],
}

export type UserType = {
  fetchUserInfoLoading: boolean
  fetchUserInfoSuccess: boolean
  fetchUserInfoError: any
  alwaysSignIn: boolean
  signInLoading: boolean
  signInSuccess: boolean
  signInError: any
  signUpLoading: boolean
  signUpSuccess: boolean
  signUpError: any
  signOutLoading: boolean
  signOutSuccess: boolean
  signOutError: any
  userPostLoading: boolean
  userPostSuccess: boolean
  userPostError: any
  clippingPostLoading: boolean
  clippingPostSuccess: boolean
  clippingPostError: boolean
  fetchAlertLoading: boolean
  fetchAlertSuccess: boolean
  fetchAlertError: any
  readAlertLoading: boolean
  readAlertSuccess: boolean
  readAlertError: any
  userInfo: UserInfoType
  signupData: {
    email?: string
  }
  signinData: {}
  userPost: PostType[]
  clippingPost: PostType[],
}

export type UserInfoType = {
  id: number;
  image?: {
    uploadedFileURL: string,
    uploadedFileKey: string
  }
  nickname: string;
  grant_type?: string;
  birthday?: string;
  gender?: 'M' | 'F';

  alertList: alertType[],
  alertDetail: PostType,
}

export type ImageType = {
  uploadedFileURL: string;
  uploadedFileKey: string;
}

export type PostStateType = {
  mainPost: PostType[]
  imagePaths?: []
  fetchedAllPost: boolean
  fetchPostLoading: boolean
  fetchPostSuccess: boolean
  fetchPostError: boolean
  addPostLoading: boolean
  addPostSuccess: boolean
  addPostError: boolean
  deletePostLoading: boolean
  deletePostSuccess: boolean
  deletePostError: boolean
  likePostLoading: boolean
  likePostSuccess: boolean
  likePostError: boolean
  unlikePostLoading: boolean
  unlikePostSuccess: boolean
  unlikePostError: boolean
  scrapPostLoading: boolean
  scrapPostSuccess: boolean
  scrapPostError: boolean
  unscrapPostLoading: boolean
  unscrapPostSuccess: boolean
  unscrapPostError: boolean
  fetchCommentLoading: boolean
  fetchCommentSuccess: boolean
  fetchCommentError: any
  addCommentLoading: boolean
  addCommentSuccess: boolean
  addCommentError: any
  updateCommentLoading: boolean
  updateCommentSuccess: boolean
  updateCommentError: any
  deleteCommentLoading: boolean
  deleteCommentSuccess: boolean
  deleteCommentError: boolean
  fetchReplyLoading: boolean
  fetchReplySuccess: boolean
  fetchReplyError: boolean
  addReplyLoading: boolean
  addReplySuccess: boolean
  addReplyError: boolean
  updateReplyLoading: boolean
  updateReplySuccess: boolean
  updateReplyError: boolean
  deleteReplyLoading: boolean
  deleteReplySuccess: boolean
  deleteReplyError: boolean
  pagingSize: number
  pagingNumber: number
  postCategory: CategoryType
  displayImagePopup: boolean
  popupIamgeArray: []
  popupImageCurrentIdx: number
}

export type PostType = {
  length: number;
  id: number;
  member_id: number;
  nickname: string;
  state_code: string; //TODO:: enum 대체 
  created_at: Date;
  category_code: CategoryType;
  category: string;
  contents: string;
  images: ImageType[];
  like_yn: "Y" | "N";
  scrap_yn: "Y" | "N";
  like_count: number;
  comment_count: number;
  comment_list: CommentType[]
}

export type CommentType = {
  id: number;
  state_code: string;
  post_id: number;
  member_id: number;
  nickname: string;
  contents: string;
  like_yn: "Y" | "N";
  reply_count: number;
  like_count: number;
  created_at: Date;
  updated_at: null | Date;
  reply_list: ReplyType[]
}

export type VideoType = {
  id: number
  banner_code: string
  category_code: string
  source: string
  priority_order: number
  created_at: Date
}

export type ReplyType = {
  id: number
  state_code: string
  comment_id: number
  member_id: number
  nickname: string
  contents: string
  like_yn: 'Y' | 'N'
  like_count: number
}

export type CuratorType = {
  id: number
  member_id: number
  nickname: string
  profile_image: {
    uploadedFileURL: string,
    uploadedFileKey: string,
  }
  source: null,
  created_at: Date,
}

export type alertType = {
  id: number
  notice_code: NoticeCode,
  check_yn: 'Y' | 'N'
  from_member_id: number
  from_nickname: string
  description: string
  contents_source: {
    post_id: number
    comment_id: number
    reply_id: number
  }
}

export enum NoticeCode {
  REPLY = 'RP',
  COMMENT = 'CM',
  OP = 'OP'
}