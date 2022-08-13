import { PostType } from "@/common/defines/Store"
import { IsMobile } from "@/common/hooks/breakpoints"
import InputPost from "@/components/InputPost"
import Popup from "@/components/Popup"
import Screen from "@/components/Screen"

interface UpdatePostPopupProps {
  display: boolean
  post: PostType
  onPrev: () => void;
}

const UpdatePostPopup = (props: UpdatePostPopupProps) => {
  return (
    <Screen
      display={ props.display }
      content={
        <>
          <InputPost
            row={5}
            popup
            placeholder="현재 떠오르는 생각들을 적어주세요"
            post={ props.post }
            onSubmit={ props.onPrev }
          />
        </>
      }
      onCancel={ props.onPrev }
    />
  )
}

export default UpdatePostPopup