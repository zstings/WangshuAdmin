import { execSync, exec } from 'node:child_process';
import { join } from 'node:path';
import process from 'process';
import { mkdirSync, existsSync, rmSync, globSync, cpSync } from 'node:fs';

// 异步执行构建
const _runBuild = runBuild();

const root = process.cwd();
const buildDir = join(root, '.build');
const buildGit = join(buildDir, '.git');

const pipe = { stdio: 'pipe', encoding: 'utf-8' };
// const inherit = { stdio: 'inherit', encoding: 'utf-8' };
const buildCwd = { cwd: buildDir };
const branch = 'dist';

// ========== 检查 .docs 是否存在, 不存在就创建 ==========
if (!existsSync(buildDir)) {
  console.log(`[INFO] 创建 ${buildDir} 目录`);
  mkdirSync(buildDir);
}

// ========== 没有 .git 就执行新的clone ==========
if (!existsSync(buildGit)) {
  console.log(`[INFO] ${buildGit} 未发现 .git，开始克隆`);
  const gitFetch = execSync('git remote get-url origin', { ...pipe }).trim();
  execSync(`git clone ${gitFetch} .`, { ...buildCwd, ...pipe });
}

// ========== 检查分支 ==========
console.log('[IBFO] 正在检查本地、远端分支');
const localExists = Boolean(execSync(`git branch --list ${branch}`, { ...buildCwd, ...pipe }).trim());
const remoteExists = Boolean(execSync(`git ls-remote --heads origin ${branch}`, { ...buildCwd, ...pipe }).trim());
if (!localExists) {
  if (remoteExists) {
    console.log(`[INFO] 本地无 ${branch} 分支，检出远端 ${branch}`);
    execSync(`git fetch origin ${branch}`, { ...buildCwd, ...pipe });
    execSync(`git checkout -b ${branch} origin/${branch}`, { ...buildCwd, ...pipe });
  } else {
    console.log(`[INFO] 本地与远端都无 ${branch}，创建 ${branch}`);
    execSync(`git checkout -b ${branch}`, { ...buildCwd, ...pipe });
  }
} else {
  console.log(`[INFO] 本地已存在 ${branch} 分支`);
  execSync(`git checkout ${branch}`, { ...buildCwd, ...pipe });
}
// ========== 如果远端没有 ${branch}，推送本地 ==========
if (!remoteExists) {
  console.log(`[INFO] 远端不存在 ${branch} 分支，推送本地分支`);
  execSync(`git push -u origin ${branch}`, { ...buildCwd, ...pipe });
}
// ========== 检查本地 ${branch} 分支是否有未推送的提交 ==========
console.log(`[INFO] 检查 ${branch} 分支状态`);
execSync(`git fetch origin ${branch}`, { ...buildCwd, ...pipe });
// 获取状态：ahead / behind / diverged 等
const status = execSync(`git rev-list --left-right --count origin/${branch}...${branch}`, { ...buildCwd, ...pipe }).trim();
const [behind, ahead] = status.split('\t').map(Number);
// ========== 存在未推送提交：先推送 ==========
if (ahead > 0 && behind === 0) {
  console.log(`[INFO] 本地 ${branch} 比远端领先 ${ahead} 次提交，正在推送`);
  execSync('git push', { ...buildCwd, ...pipe });
}
// ========== 强制同步远端 ${branch} ==========
console.log(`[INFO] 强制同步远端 ${branch} 分支（确保完全一致）`);
execSync(`git fetch origin ${branch}`, { ...buildCwd, ...pipe });
execSync(`git reset --hard origin/${branch}`, { ...buildCwd, ...pipe }); // local = remote
console.log(`[DONE] ${branch} 分支准备完毕`);
// ========== 清空 buildDir 目录 并 复制 dist 内容 ==========
globSync(buildDir + '/*').forEach(file => {
  rmSync(file, { recursive: true, force: true });
});
console.log(`[INFO] 清空 ${branch} 目录完成`);
await _runBuild; // 等待构建完成
cpSync('./docs', buildDir, { recursive: true });
console.log('[INFO] 复制 dist 内容完成');
// ========== 提交 ==========
console.log(`[INFO] 开始提交到${branch}分支`);
execSync('git add .', { ...buildCwd, ...pipe });
if (execSync('git status --porcelain', { ...buildCwd, ...pipe }).trim() == '') {
  console.log('[INFO] ✅ 没有新文件 ❤️');
  process.exit(1);
}
execSync('git commit -m "deploy"', { ...buildCwd, ...pipe });
execSync(`git push origin ${branch}`, { ...buildCwd, ...pipe });
console.log('[INFO] ✅ 执行完成 ❤️');

function runBuild() {
  return new Promise((resolve, reject) => {
    exec('pnpm build', error => {
      if (error) {
        reject(error);
        process.exit(1);
      }
      resolve();
    });
  });
}
