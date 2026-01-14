import baseConfig from "../../eslint.base.config.mjs";

/**
 * VS Code Extension용 ESLint 설정
 * 공통 설정을 확장하여 Node.js 환경에 맞게 설정
 */
export default [
  ...baseConfig,
  {
    files: ["**/*.ts"],
    // Node.js 환경에 필요한 추가 설정이 있다면 여기에 추가
  },
];
