import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import baseConfig from "../../eslint.base.config.mjs";

/**
 * GUI (React)용 ESLint 설정
 * 공통 설정을 확장하여 React 관련 설정을 오버라이드
 */
export default defineConfig([
  globalIgnores(["dist"]),
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022, // 공통 설정과 통일
      globals: globals.browser,
    },
    // 공통 설정의 rules를 오버라이드하거나 추가할 수 있음
    rules: {
      // React 관련 추가 규칙이 있다면 여기에 추가
    },
  },
]);
