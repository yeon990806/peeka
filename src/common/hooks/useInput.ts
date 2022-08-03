import { useState, useCallback } from "react"

export default (initialValue = null) => {
  const [value, setValue] = useState<any>(initialValue)
  
  const handler = useCallback((e) => {
    setValue(e.target.value)
  }, [])

  return [value, handler]
}