import { PopupCode } from "@/common/defines/Popup";
import { IsMobile } from "@/common/hooks/breakpoints";
import { getCookie } from "@/common/libs/Cookie";
import Button from "@/components/Button";
import Popup from "@/components/Popup";
import Screen from "@/components/Screen";
import Textarea from "@/components/Textarea";
import { openPopup } from "@/store/reducer/popup";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import style from "./style.module.scss"

interface ReportPopupProps {
  postId: number;
  display: boolean;
  onPrev: () => void;
}

const ReportPopup = (props: ReportPopupProps) => {
  const dispatch = useDispatch()
  const mobileScreen = IsMobile()
  const [reportText, setReportText] = useState<string>('')
  const [renderComplete, setRenderComplete] = useState<boolean>(false)

  const PopupContent = (submitButton: boolean) => (
    <>
      <Textarea
        value={ reportText }
        placeholder="게시물 신고 사유를 적어주세요."
        onInput={ (v: string) => onChangeReportText(v) }
        onEnter={ onSubmitReport }
        fixedHeight
        row={5}
      />
      { submitButton && <Button
        block
        type="action"
        theme="primary"
        size="xl"
        additionalClass={ style.ReportButton }
        onClick={ onSubmitReport }
      >
        신고하기
      </Button> }
    </>
  )

  const onChangeReportText = useCallback((v: string) => setReportText(v), [reportText])

  const onSubmitReport = useCallback(() => {
    const data = {
      postId: props.postId,
      contents: reportText
    }
    axios.post('/api/report/violation/post', data, {
      headers: {
        'Authorization': `Bearer ${ getCookie('accessToken') }`,
      }
    }).then((resp) => {
      if (resp.status === 200)
        dispatch(openPopup(PopupCode.REPORT_SUCCESS, props.onPrev()))
    }).catch((err) => {
      dispatch(openPopup(PopupCode.UNKNOWN))
    })
  }, [reportText])

  useEffect(() => {
    setRenderComplete(true)
  }, [])

  if (!props.display || !renderComplete) return null

  if (mobileScreen)
    return <Screen
      display
      title="게시물 신고"
      content={ PopupContent(true) }
      onCancel={ props.onPrev }
    />
  else
    return <Popup
      display
      type="input"
      submitText="신고"
      buttonAlign="right"
      content={ PopupContent(false) }
      onCancel={ props.onPrev }
      onClick={ onSubmitReport }
    />
}

export default ReportPopup