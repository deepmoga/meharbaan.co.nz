import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple secret token to protect this endpoint
const DEPLOY_TOKEN = process.env.DEPLOY_TOKEN || "meharbaan-deploy-2026";

export async function POST(request: Request) {
  try {
    const { token } = await request.json() as { token?: string };
    if (token !== DEPLOY_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cwd = process.cwd();
    const steps: string[] = [];

    // git pull
    const pull = await execAsync("git pull origin main", { cwd, timeout: 60000 });
    steps.push(`git pull: ${pull.stdout.trim() || pull.stderr.trim()}`);

    // npm install
    const install = await execAsync("npm ci --production=false", { cwd, timeout: 120000 });
    steps.push(`npm ci: ${install.stdout.slice(-200).trim() || install.stderr.slice(-200).trim()}`);

    // build
    const build = await execAsync("npm run build", { cwd, env: { ...process.env, NODE_ENV: "production" }, timeout: 300000 });
    steps.push(`build: ${build.stdout.slice(-200).trim() || build.stderr.slice(-200).trim()}`);

    // restart via pm2 if available
    try {
      const restart = await execAsync("pm2 restart all", { cwd, timeout: 30000 });
      steps.push(`pm2 restart: ${restart.stdout.trim()}`);
    } catch {
      steps.push("pm2 not found, skipping restart");
    }

    return NextResponse.json({ ok: true, steps });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (token !== (process.env.DEPLOY_TOKEN || "meharbaan-deploy-2026")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, cwd: process.cwd(), version: process.version });
}
