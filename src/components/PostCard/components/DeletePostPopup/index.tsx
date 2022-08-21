import { StorePostType } from "@/common/defines/Store";
import Popup from "@/components/Popup";
import { DELETE_POST_REQUEST } from "@/store/reducer/post";
import { memo, useCallback } from 'react';
import { useDispatch } from "react-redux";

interface DeletePostPopupProps {
  postId: number;
  postType: StorePostType
  display: boolean;
  onPrev: () => void;
}

const DeletePostPopup = memo((props: DeletePostPopupProps) => {
  const dispatch = useDispatch()

  const deletePost = useCallback(() => {
    dispatch({
      type: DELETE_POST_REQUEST,
      data: {
        postId: props.postId,
        postType: props.postType,
      }
    })

    props.onPrev()
}, [props.postId, props.postType])

  if (!props.display) return null

  return <Popup
    display={ props.display }
    content="정말 이 포스트를 삭제하시겠습니까?"
    type="confirm"
    buttonAlign="right"
    onCancel={ () => props.onPrev() }
    onClick={ () => deletePost() }
  />
})

export default memo(DeletePostPopup)