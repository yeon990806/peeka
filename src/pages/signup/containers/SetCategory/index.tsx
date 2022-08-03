import { useState } from 'react';
import { SignupCategory } from "@/common/defines/Signup"
import { Mobile } from "@/common/hooks/breakpoints"
import SignUpContainer from "../../components/SignUpContainer"

import style from "./style.module.scss"
import Button from '@/components/Button';

const SetCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const toggleCategory = (i: number) => {
    const idx = selectedCategory.findIndex(elem => elem === SignupCategory[i])
    
    if (idx < 0) setSelectedCategory([...selectedCategory, SignupCategory[i]])
    else setSelectedCategory(interestArr => interestArr.filter(item => item !== SignupCategory[i]))
  }

  const getButtonClass = (i: number): number => {
    return selectedCategory.findIndex(elem => elem === SignupCategory[i])
  }

  return (
    <SignUpContainer
      content={
        <div className={ style.Category }>
          { SignupCategory.map((v, i) => ( 
          <Button
            block
            key={i}
            type="border"
            size="xl"
            theme={ getButtonClass(i) > -1 ? "primary" : "gray" }
            onClick={ () => {
              toggleCategory(i)
            } }
          >
            { v }
          </Button>
        )) }
        </div>
      }
    />
  )
}

export default SetCategory