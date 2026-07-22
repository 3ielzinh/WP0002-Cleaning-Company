# Windows Commands
Run from the project root in PowerShell.
- Install: `npm.cmd ci`.
- Dev (package script uses Unix env assignment and is not PowerShell-portable): `$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'; npx.cmd --no-install vite`.
- Verified vinext production build (requires Git Bash and GNU timeout): `& 'C:\Program Files\Git\bin\bash.exe' scripts/build-verified.sh`.
- Tests after a successful build: `node --test tests/rendered-html.test.mjs`.
- Lint without Bash wrapper: `npx.cmd --no-install eslint . --ignore-pattern dist --ignore-pattern .next --ignore-pattern .wrangler --ignore-pattern .vinext --ignore-pattern .serena`.
- Typecheck: `npx.cmd --no-install tsc --noEmit --incremental false`.
- Artifact validation only: `& 'C:\Program Files\Git\bin\bash.exe' scripts/validate-artifact.sh`.
- Package scripts `dev`, `lint`, `build`, and therefore `test` assume Bash/Unix utilities; invoking them via ordinary PowerShell may resolve the WSL `bash` alias and fail if no WSL distribution is installed.