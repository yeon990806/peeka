import { IsMobile } from "@/common/hooks/breakpoints"
import InputPost from "@/components/InputPost";
import Popup from "@/components/Popup"
import Screen from "@/components/Screen";
import { useMemo } from "react";

interface CommentPopupProps {
  postIdx: number;
  display: boolean;
  onChange: () => void;
}

const CommentPopup = (props: CommentPopupProps) => {
  const screenStyle = useMemo(() => ({
    marginTop: 0,
  }), [])

  if (IsMobile)
    return <Screen
      display={ props.display }
      onCancel={ props.onChange }
      content={ <InputPost
        popup
        postIdx={ props.postIdx }
        placeholder="댓글을 입력하세요"
        onSubmit={ props.onChange }
      /> }
      style={ screenStyle }
    />
  return (
    <Popup 
      display={ props.display }
      type="input"
      buttonAlign="right"
      onCancel={ props.onChange }
    />
  )
}

export default CommentPopup