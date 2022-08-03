import SetCategory from "../../containers/SetCategory";

import style from "./style.module.scss"

interface CategoryPopupProps {
  display: boolean;
  username?: string;
}

const CategoryPopup = (props: CategoryPopupProps) => {
  if (!props.display) return null;

  return (
    <div>
      <>
        <div className={ style.SetCategoryGreeting }>
          { props.username }님, 반가워요!
        </div>
        <h1 className={ style.SetCategoryTitle }>
          관심분야를 모두 선택해주세요!
        </h1>
      </>
    </div>
  )
}

export default CategoryPopup