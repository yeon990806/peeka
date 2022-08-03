import React from "react"
import style from "./style.module.scss"

interface SignUpContainerProps {
  content: React.ReactNode;
  option?: React.ReactNode;
}

const SignUpContainer = (props: SignUpContainerProps) => {
  return (
    <div className={ style.SignupContentContainer }>
      <section className={ style.SignupContent }>
        { props.content }
      </section>
      { props.option && <div className={ style.SignupOption }>
        { props.option }
      </div> }
    </div>
  )
}

export default SignUpContainer