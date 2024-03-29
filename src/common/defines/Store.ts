import { CategoryType } from "./Category";
import { PopupCode } from "./Popup";

export type StateType = {
  user: UserType,
  post: PostStateType,
  content: ContentStateType,
  extra: ExtraStateType,
  comment: CommentStateType,
  reply: ReplyStateType,
  popup: PopupStateType,
  signIn?: {},
  signUp?: {},
}

export type UserType = {
  fetchUserInfoLoading: boolean
  fetchUserInfoSuccess: boolean
  fetchUserInfoError: any
  reIssueLoading: boolean
  reIssueSuccess: boolean
  reIssueError: any
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
  fetchDone: boolean
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
  userPost: PostType[],
  userPostInfo: UserPostInfoType,
}

export type PostStateType = {
  mainPost: PostType[]
  imagePaths?: []
  fetchedAllPost: boolean
  fetchPostLoading: boolean
  fetchPostSuccess: boolean
  fetchPostError: boolean
  fetchDone: boolean
  addPostLoading: boolean
  addPostSuccess: boolean
  addPostError: boolean
  updatePostLoading: boolean
  updatePostSuccess: boolean
  updatePostError: any
  deletePostLoading: boolean
  deletePostSuccess: boolean
  deletePostError: boolean
  postCategory: CategoryType
  displayImagePopup: boolean
  popupIamgeArray: []
  popupImageCurrentIdx: number
}

export type ContentStateType = {
  fetchCreatorLoading: boolean
  fetchCreatorSuccess: boolean
  fetchCreatorError: any
  fetchVideoLoading: boolean
  fetchVideoSuccess: boolean
  fetchVideoError: any
  creatorList: CreatorList[],
  videoList: VideoType[],
}

export type ExtraStateType = {
  extraList: PostType[],
  extraUserInfo: UserPostInfoType,
  fetchExtraListRequest: boolean,
  fetchExtraListSuccess: boolean,
  fetchExtraListError: any,
  fetchDone: boolean,
  fetchLinkedPostRequest: boolean,
  fetchLinkedPostSuccess: boolean,
  fetchLinkedPostError: any,
}

export type CommentStateType = {
  fetchCommentLoading: boolean,
  fetchCommentSuccess: boolean,
  fetchCommentError: any,
  addCommentLoading: boolean,
  addCommentSuccess: boolean,
  addCommentError: any,
  updateCommentLoading: boolean,
  updateCommentSuccess: boolean,
  updateCommentError: any,
  deleteCommentLoading: boolean,
  deleteCommentSuccess: boolean,
  deleteCommentError: any
}

export type ReplyStateType = {
  fetchReplyLoading: boolean,
  fetchReplySuccess: boolean,
  fetchReplyError: any,
  addReplyLoading: boolean,
  addReplySuccess: boolean,
  addReplyError: any,
  updateReplyLoading: boolean,
  updateReplySuccess: boolean,
  updateReplyError: any,
  deleteReplyLoading: boolean,
  deleteReplySuccess: boolean,
  deleteReplyError: any
}

export type ReactionStateType = {
  toggleLikeLoading: boolean
  toggleLikeSuccess: boolean
  toggleLikeError: any
  toggleScrapLoading: boolean
  toggleScrapSuccess: boolean
  toggleScrapError: any
}

export type PopupStateType = {
  popupDisplay: boolean
  signInPopupDisplay: boolean
  popupCode: PopupCode | null
  callback?: () => void | null
}

export type UserInfoType = {
  id: number;
  email?: string;
  nickname: string;
  image?: {
    uploadedFileURL: string,
    uploadedFileKey: string
  }
  grant_type?: string;
  birthday?: string;
  gender?: 'M' | 'F';

  alertList: alertType[],
  alertDetail: PostType[],
}

export type UserPostInfoType = {
  birthday: string
  email: string
  gender: string
  id: 51
  image: {
    uploadedFileURL: string,
    uploadedFileKey: string
  }
  member_code: string
  nickname: string
}

export type ImageType = {
  uploadedFileURL: string;
  uploadedFileKey: string;
}

export type PostType = {
  length: number;
  id: number;
  member_id: number;
  member_image: string;
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
  comment_done: boolean;
  comment_list: CommentType[]
  display_comment: boolean
  tags: string[]
}

export type CommentType = {
  id: number;
  state_code: string;
  post_id: number;
  member_image: string;
  member_id: number;
  nickname: string;
  contents: string;
  like_yn: "Y" | "N";
  reply_count: number;
  reply_done: boolean;
  like_count: number;
  created_at: Date;
  updated_at: null | Date;
  reply_list: ReplyType[]
  display_reply: boolean
}

export type VideoType = {
  id: number
  title?: string
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
  member_image: string
  member_id: number
  nickname: string
  contents: string
  like_yn: 'Y' | 'N'
  like_count: number
  added?: boolean
}

export type CreatorList = {
  id: number
  member_id: number
  nickname: string
  member_image: string
  source: null,
  created_at: Date,
  category_code: CategoryType,
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

export enum StorePostType {
  MainPost = 0,
  UserPost = 1,
  ExtraPost = 2,
  Alert = 3,
}

export enum ActionContentType {
  Post = 0,
  Comment = 1,
  Reply = 2,
}