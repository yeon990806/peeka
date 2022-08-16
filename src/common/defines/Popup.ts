export enum PopupCode {
  DUPLICATION_ERROR = 0, // email or nickname 중복
  NOT_FOUND = 1, // email or password 찾을 수 없음 / 가입된 계정이 아님 / 가입된 이메일 주소가 아님
  FORBIDDEN_ACCESS = 2, // 탈퇴 또는 정지된 계정 / 기존 비밀번호와 다름 / 재입력 비밀번호가 다름. / 소유주가 다름 / 
  STATE_CONFLICT = 3, // 이미 좋아요를 누름, 좋아요를 누른 콘텐츠가 아님, 이미 스크랩, 스크랩 X,
  CATEGORY_NULL = 4, // 포스트 카테고리가 지정되지 않음
  COMPLETE = 5, // 완료되었습니다.
  SEND_TEMP_PW_SUCCESS = 6,
  UNKNOWN = 7,
  REPORT_SUCCESS = 8, // 신고 완료.
  REQUEST_SIGN_IN = 9, // 로그인으로 유도함
}