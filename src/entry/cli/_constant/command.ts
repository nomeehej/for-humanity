import {copy_dir_description, copy_host_description, copy_preview_private_description, copy_private_description} from "@/entry/cli/_constant/copy";

/**
 * 명령 생략 시 dev
 */
export const command_default = "dev";

/**
 * 프로젝트 폴더 생략 시 현재 폴더
 */
export const command_args = {
    dir: {type: "positional", description: copy_dir_description, default: "."},
} as const;

/**
 * dev의 프로젝트 폴더, 일회성 수신 주소 입력
 */
export const command_server_args = {
    ...command_args,
    host: {type: "string", description: copy_host_description, valueHint: "address"},
} as const;

/**
 * build의 프로젝트 폴더, 내부판 출력 선택
 */
export const command_build_args = {
    ...command_args,
    private: {type: "boolean", description: copy_private_description},
} as const;

/**
 * preview의 프로젝트 폴더, 일회성 수신 주소, 내부판 출력 선택
 */
export const command_preview_args = {
    ...command_server_args,
    private: {type: "boolean", description: copy_preview_private_description},
} as const;
