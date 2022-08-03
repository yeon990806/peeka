export enum SignupStepType {
  EmailAuth = 0,
  InputInfo = 1,
  // SetCategory = 2, 2차 업데이트
}

export enum InputStepType {
  InputUserName = 0,
  InputPassword = 1,
  InputBirthDate = 2,
  InputUserGender = 3,
  AgreeTerms = 4,
}

export enum genderType {
  M = 0,
  F = 1,
}

export enum userType {
  normal = "GN",
  google = "GG",
}

export interface SignUpReturnType {
  id: number;
  nick_name: string;
  grant_type: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_in: Date;
}

export const SignupCategory = ["웹툰", "웹소설", "영화", "드라마", "애니메이션", "게임"]