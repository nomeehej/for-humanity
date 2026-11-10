// ----------------------------------------------------------------------------------------
// GitHub Pages 템플릿의 단계 인덱스
//
// deploy_node_step_index: Node 설정
// deploy_manager_step_index: 패키지 매니저 설정
// deploy_install_step_index: 의존성 설치
// deploy_build_step_index: 문서 빌드
// deploy_artifact_step_index: 아티팩트 업로드
// ----------------------------------------------------------------------------------------
export const deploy_node_step_index = 1;
export const deploy_manager_step_index = 2;
export const deploy_install_step_index = 3;
export const deploy_build_step_index = 4;
export const deploy_artifact_step_index = 5;

// ----------------------------------------------------------------------------------------
// Workers 배포 파일의 검증한 CLI 버전과 런타임 기준일
// ----------------------------------------------------------------------------------------
export const deploy_workers = {version: "4.152.0", compatibility_date: "2026-10-23", name_length_limit: 63} as const;
