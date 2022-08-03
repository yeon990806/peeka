import { useState } from "react";
import Button from "../Button";

import style from "./style.module.scss"

interface HashType {
  tagName: string;
  selected: boolean;
}

const HashContainer = () => {
  const [hashList, setHashList] = useState<HashType[]>([{ tagName: "호랑이형님", selected: false }, { tagName: "신의 탑", selected: true }, { tagName: "호랑이형님", selected: false }, { tagName: "신의 탑", selected: true }, { tagName: "호랑이형님", selected: false }, { tagName: "신의 탑", selected: true },]);

  return (
    <div className={ style.HashContainer }>
      <div className={ style.Hash }>
        { hashList.map((v, i) => (
          <Button
            key={ i }
            type="hashtag"
            theme={ v.selected ? "primary" : "gray" }
          >
            #{ v.tagName }
          </Button>
        )) }
      </div>
    </div>
  )
}

export default HashContainer