// ----------------------------------------------------------------------------------------
// 실행 환경 변수
//
// env_package_agent: CLI 실행 패키지 매니저와 버전, 직접 실행 시 없음
// env_ci: 비대화형 실행 알림용 외부 CI 표시
// ----------------------------------------------------------------------------------------
export const env_package_agent = process.env.npm_config_user_agent;
export const env_ci = process.env.CI;
