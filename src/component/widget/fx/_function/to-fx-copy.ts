import {copy_fx} from "@/component/widget/fx/_constant/copy";
import type {FxCopy} from "@/component/widget/fx/_type/copy";

// ----------------------------------------------------------------------------------------
// 페이지 언어의 조작부 문구
//
// 기본 하위 태그 ko만 한국어, 날짜 라벨과 같은 규칙
// Intl.Locale 예외 시 영어, 언어 태그가 비었거나 잘못된 경우
// ----------------------------------------------------------------------------------------
export const toFxCopy = (lang: string): FxCopy => {
    try {
        return new Intl.Locale(lang).language === "ko" ? copy_fx.ko : copy_fx.en;
    } catch {
        return copy_fx.en;
    }
};
