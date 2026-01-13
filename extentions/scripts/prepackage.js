const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const rootDir = path.join(__dirname, "../..");
const guiDir = path.join(rootDir, "gui");
const extentionsDir = path.join(rootDir, "extentions");
const guiDistDir = path.join(guiDir, "dist");
const targetGuiDir = path.join(extentionsDir, "gui");

// 원래 작업 디렉토리 저장
const originalCwd = process.cwd();

try {
  console.log("📦 Building GUI...");
  process.chdir(guiDir);
  execSync("npm run build", { stdio: "inherit" });

  // dist 폴더 존재 확인
  if (!fs.existsSync(guiDistDir)) {
    throw new Error(`GUI build failed: ${guiDistDir} does not exist`);
  }

  console.log("📋 Copying GUI build to Extension...");
  // 기존 gui 폴더가 있으면 삭제
  if (fs.existsSync(targetGuiDir)) {
    fs.rmSync(targetGuiDir, { recursive: true, force: true });
  }
  // dist 폴더를 gui로 복사
  fs.cpSync(guiDistDir, targetGuiDir, { recursive: true });

  console.log("✅ GUI build and copy completed!");
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
} finally {
  // 원래 작업 디렉토리로 복원
  process.chdir(originalCwd);
}
