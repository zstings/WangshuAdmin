import { execSync, exec } from 'node:child_process';
import { join } from 'node:path';
import process from 'process';
import { mkdirSync, existsSync, rmSync, globSync, cpSync, writeFileSync } from 'node:fs';

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
  execSync(`git clone --depth 1 ${gitFetch} .`, { ...buildCwd, ...pipe });
}

// ========== 检查分支 ==========
console.log(`[INFO] 正在检查本地、远端分支 ${branch}`);
console.log(`[INFO] 设置追踪所有远端分支`);
execSync('git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"', { ...buildCwd, ...pipe });
console.log(`[INFO] 同步所有远端分支`);
execSync(`git fetch origin --prune`, { ...pipe, ...buildCwd });
console.log(`[INFO] 切换到目标分支 ${branch}`);
// 本地存在就切换过去，没有就创建后切换过去
execSync(`git checkout -B ${branch}`, buildCwd);
try {
  // 判断远端分支是否存在
  execSync(`git rev-parse --verify origin/${branch}`, { ...pipe, ...buildCwd });
  // 如果当前分支就是目标分支，且有修改的话放弃文件追踪和暂存
  execSync(`git reset --hard HEAD`, { ...pipe, ...buildCwd });
  // 如果当前分支就是目标分支，检查是不是存在 git commit 后，更改已经进入了本地的仓库历史但还没有推送的记录
  execSync(`git fetch origin ${branch}`, { ...buildCwd, ...pipe });
  // 获取状态：ahead / behind / diverged 等
  const status = execSync(`git rev-list --left-right --count origin/${branch}...${branch}`, { ...buildCwd, ...pipe }).trim();
  const [behind, ahead] = status.split('\t').map(Number);
  // ========== 存在未推送提交：先推送 ==========
  if (ahead > 0 && behind === 0) {
    console.log(`[INFO] 本地 ${branch} 比远端领先 ${ahead} 次提交，正在推送`);
    execSync('git push', { ...buildCwd, ...pipe });
  }
  console.log(`[INFO] 远端分支 ${branch} 存在，正在同步`);
  // 无论当前分支是不是目标分支，只要远端分支存在就切换,会自动同步最新远端
  execSync(`git checkout -B ${branch} origin/${branch}`, { ...pipe, ...buildCwd });
} catch (_) {
  console.log(`[INFO] 远端分支 ${branch} 不存在，正在创建`);
  // 远端分支不存在，清空内容后提交到远端
  try {
    execSync(`git rm -rf .`, { ...pipe, ...buildCwd });
  } catch (_) {}
  writeFileSync(`${buildDir}/初始化-${new Date().toLocaleString().replace(/[/ :]/g, '')}.txt`, '初始化', 'utf-8');
  execSync(`git add .`, { ...pipe, ...buildCwd });
  execSync(`git commit -m "新分支初始化"`, { ...pipe, ...buildCwd });
  execSync(`git push origin ${branch}`, { ...pipe, ...buildCwd });
}
console.log(`[INFO] 目标分支 ${branch} 以准备就绪`);
// ========== 清空 buildDir 目录 并 复制 dist 内容 ==========
globSync(buildDir + '/*').forEach(file => {
  rmSync(file, { recursive: true, force: true });
});
console.log(`[INFO] 清空 ${branch} 目录完成`);
await _runBuild; // 等待构建完成
cpSync('./dist', buildDir, { recursive: true });
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
