/**
 * state(Y, N)을 boolean 값으로 변환해 리턴해주는 함수입니다.
 * @param state
 * @returns boolean
 */
export function convertStateBoolean (state: string | null | boolean) {
  return (state === 'Y' || state === true) ? true : false
}

/**
 * @param postDate 날짜를 받습니다.
 * @returns yyyy-mm-dd hh:mm:ss 형태로 반환합니다.
 */
export function getLongDateFormat (postDate: Date) {
  const date = new Date(postDate)
  const y = date.getFullYear()
  const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : date.getMonth()
  const d = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate()
  const h = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getDate()
  const min = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes()
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds()

  return `${ y }-${ m }-${ d } ${ h }:${ min }:${ s }`
}

/**
 * @param image Baes64(ASCII) 형태로 변경할 이미지 파일입니다.
 * @returns 인코딩된 데이터를 반환합니다.
 */
export function encodeFileToBase64 (image: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(image)
    reader.onload = (event: any) => resolve(event.target.result)
    reader.onerror = (error) => reject(error)
  })
}