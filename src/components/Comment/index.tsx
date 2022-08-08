import Button from "../Button";
import style from "./style.module.scss"

interface CommentProps {
  profileImg?: string;
  userName?: string;
  content?: string;
  likeCnt?: number;
  dateTime?: string;
  commentCnt?: number;
}

const Comment = (props: CommentProps) => {
  return (
    <div className={ style.Comment }>
      <img src="/images/person.svg" />
      <div className={ style.CommentContentContainer }>
        <div className={ style.CommentInfo }>
          <h1> { props.userName } </h1>
          <p> { props.content } </p>
        </div>
        <div className={ style.CommentMenu }>
          <Button>
            <img src="/images/favorite.svg" tabIndex={-1} />
            <span>{ props.likeCnt }</span>
          </Button>
          <button>답글달기</button>
          <button>{ props.dateTime }</button>
        </div>
        <div className={ style.CommentContainer }>
          <button>
            답글{ props.commentCnt }개 보기 &nbsp;<img src="/images/more-comment.svg" tabIndex={-1} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Comment