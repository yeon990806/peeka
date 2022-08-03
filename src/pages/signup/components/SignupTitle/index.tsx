import { SignupStepType } from "@/common/defines/Signup"

interface SignupTitleProps {
  step: SignupStepType
}

const SignupTitle = (props: SignupTitleProps) => {
    switch (props.step) {
      case SignupStepType.EmailAuth:
      case SignupStepType.InputInfo:
        return <>가입하기</>
        // case SignupStepType.SetCategory:
        // return <>
        //   <div>
        //     <span>관심분야</span>를
        //   </div>
        //   <div>
        //     모두 선택해주세요
        //   </div>
        // </>
    }
}

export default SignupTitle