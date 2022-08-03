import Button from "../Button"
import style from "./style.module.scss"

const PostButton = ({ onClick }) => {
  return (
    <Button
      additionalClass={ style.PostButton }
      theme="primary"
      onClick={ () => onClick() }
    >
      <img src="/images/post.svg" tabIndex={-1} />
    </Button>
  )
}

export default PostButton