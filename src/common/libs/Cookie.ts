import Cookies from 'universal-cookie'

interface GetCookieOptions {
  doNotParse: boolean // 쿠키를 객체로 변환하지 않음.
}

interface SetCookieOptions {
  path?: string; // 쿠키 경로, 모든 페이지에서 사용하려면 '/' 로 사용
  expires?: Date; // 쿠키의 만료 일자 (절대값)
  maxAge?: number; // 클라이언트가 쿠키를 수신한 시점부터의 만료 일자 (상대값)
  domain?: string; // 쿠키의 도메인
  secure?: boolean; // HTTPS를 통해서만 접근할 수 있는지 설정
  httpOnly?: boolean; // 서버만 쿠키를 엑세스할 수 있는지 설정
  sameSite?: boolean | "none" | "lax"| "strict"; // Strict 또는 Lax 적용
}

const cookies = new Cookies()

export const setCookie = (name: string, value: string, option?: SetCookieOptions) => cookies.set(name, value, { ...option })

export const getCookie = (name: string) => cookies.get(name)

export const removeCookie = (name: string, option?: SetCookieOptions) => cookies.remove(name, { ...option })