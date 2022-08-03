import { IsMobile } from "@/common/hooks/breakpoints";
import Button from "@/components/Button";
import Screen from "@/components/Screen";
import Textarea from "@/components/Textarea";
import { useCallback, useEffect, useState } from "react";

import style from "./style.module.scss"

interface ReportPopupProps {
  postId: number;
  display: boolean;
  onPrev: () => void;
}

const ReportPopup = (props: ReportPopupProps) => {
  const mobileScreen = IsMobile()
  const [reportText, setReportText] = useState<string>('')
  const [renderComplete, setRenderComplete] = useState<boolean>(false)

  const onChangeReportText = useCallback((v: string) => setReportText(v), [reportText])

  const fetchReportBoard = useCallback(() => {
    
  }, [reportText])

  useEffect(() => {
    setRenderComplete(true)
  }, [])

  if (!props.display || !renderComplete) return null

  if (mobileScreen)
    return <Screen
      display
      title="게시물 신고"
      onCancel={ props.onPrev }
      content={ 
        <>
          <Textarea
            value={ reportText }
            placeholder="게시물 신고 사유를 적어주세요."
            row={ 10 }
            onInput={ (v: string) => onChangeReportText(v) }
            onEnter={ () => fetchReportBoard() }
          />
          <Button
            block
            type="action"
            theme="primary"
            size="xl"
            additionalClass={ style.ReportButton }
            onClick={ () => fetchReportBoard() }
          >
            신고하기
          </Button>
        </>
      }
    >
    </Screen>
  else
    return (
      <></>
    )
}

export default ReportPopup