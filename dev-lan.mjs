import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { networkInterfaces } from "node:os";

const lan = Object.values(networkInterfaces())
  .flat()
  .find((entry) => entry && entry.family === "IPv4" && !entry.internal);

if (!lan) {
  console.error("No Wi-Fi or Ethernet address found. Join a network first.");
  process.exit(1);
}

const isFree = (port) =>
  new Promise((resolve) => {
    const probe = createServer();
    probe.once("error", () => resolve(false));
    probe.listen(port, "0.0.0.0", () => probe.close(() => resolve(true)));
  });

for (const port of [3000, 4000]) {
  if (!(await isFree(port))) {
    console.error(
      `Port ${port} is busy. Stop the running \`pnpm dev\` (app and server) first — dev:lan starts both itself.`,
    );
    process.exit(1);
  }
}

const app = `http://${lan.address}:3000`;
const api = `http://${lan.address}:4000`;

console.log(`
  App   ${app}
  API   ${api}

  Open the App URL on your phone (same Wi-Fi). QR plates printed while this
  runs point at that address too. Press Ctrl+C to stop both servers.
`);

const run = (args, cwd, env) =>
  spawn("pnpm", args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });

const server = run(["dev"], "server", {
  CLIENT_ORIGIN: `${app},http://localhost:3000`,
  API_ORIGIN: api,
});

const web = run(["exec", "next", "dev", "-H", "0.0.0.0"], ".", {
  NEXT_PUBLIC_API_ORIGIN: api,
  LAN_HOST: lan.address,
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.kill(signal);
    web.kill(signal);
  });
}
