import React from "react"
import classNames from "classnames";
import style from "./style.module.scss"

interface SignUpContainerProps {
  content: React.ReactNode;
  option?: React.ReactNode;
  notStretch?: boolean
}

const SignUpContainer = (props: SignUpContainerProps) => {
  return (
    <div className={ classNames(style.SignupContentContainer, props.notStretch && style.NotStretch) }>
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