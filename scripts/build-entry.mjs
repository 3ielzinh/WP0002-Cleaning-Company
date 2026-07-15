import { spawnSync } from "node:child_process";

const isVercel = process.env.VERCEL === "1";
const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";

const command = isVercel
  ? {
      bin: npxBin,
      args: ["--no-install", "next", "build"],
      label: "next build",
    }
  : {
      bin: "bash",
      args: ["scripts/build-verified.sh"],
      label: "verified vinext build",
    };

const result = spawnSync(command.bin, command.args, {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(`Failed to run ${command.label}:`, result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
