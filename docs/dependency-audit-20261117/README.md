# Development dependency audit, 17 November 2026

Baseline: canonical `main` at `c363481`. Public npm package remains 0.1.1. A fresh source checkout was used; no edits were made to another agent's Fleetkeep staging directory.

## Supported maintenance candidate

Updated the existing development parents forward: `@n8n/node-cli` 0.54.3 to the current `latest` tag 0.57.3, `n8n-workflow` 2.45.1 to 2.49.0 and TypeScript 5.9.2 to 5.9.3. The published 0.58.0 CLI line was also inspected; its AI SDK still pins Zod 3 and does not remove the major-contract boundary below. No unsupported downgrade, dependency override, private fork, weakened rule or custom replacement validator remains in the candidate.

- Frozen `npm ci --ignore-scripts --no-audit`: passes.
- `npm ls --all`: passes.
- Official strict `npm run build`: passes.
- Official strict `npm run lint`: passes, with two existing operation-label style warnings. Its exact standard ESLint configuration is retained.
- Existing six contract tests pass: GET-only routes/origin, required PKCE/read-only scopes, safe incomplete-list handling, malformed-response rejection, no sends/writes/credentials in the example, and absent completeness metadata.
- Rebuilt runtime JavaScript, icons, node metadata and declarations are byte-identical to the existing published 0.1.1 tarball. The generated distribution package manifest differs only in development versions. No new public package release is necessary for these source-only changes.
- Fresh production-only registry audit: zero findings.
- Fresh complete registry audit: 42 development records, 28 high and 14 moderate. These are not represented as resolved.

## Concrete upstream boundaries

The official CLI loads an AI SDK and n8n backend dependency graph even for this small declarative node. N8n SDK packages pin Zod 3.25.76 while the advisory fix starts at 4.6.6; replacing it globally would violate those packages' declared API contract. Backend tooling also pins stream-json 1.9.1, whose patched line is 3.x. LangChain's UUID 10 contract, legacy picomatch 2.x consumers and older glob/minimatch parents remain separate major-version boundaries.

Strict community-node validation explicitly rejects `overrides`/`resolutions` in the package manifest and modified default ESLint configuration. Those safeguards were kept intact. A root-only local matcher file dependency does not prove that nested consumers use the repair; no unused fork wiring is retained.

Independent bounded review rejected a blanket fork of the complete SDK/CLI graph. Replacing the CLI with a smaller compiler wrapper would require reproducing its full platform constraints and still would not remove the workflow SDK's Zod boundary. The remaining development findings therefore need compatible upstream SDK/CLI releases or a separately designed and verified SDK migration. A zero runtime audit does not close them.

## Scope and recovery

No runtime node source, credentials, OAuth scopes, workflow example, package version, publishing workflow, customer connection or provider state changed. No npm publish was run. The old 0.1.1 package and baseline Git commit remain recovery sources. The candidate is retained in a reviewable branch with the unresolved audit status explicit; temporary installation, build and cache files are removed after retaining compact proof.
