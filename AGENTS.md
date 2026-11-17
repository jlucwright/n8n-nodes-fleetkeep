# n8n Fleetkeep node

Canonical source for the published `n8n-nodes-fleetkeep` package. The similarly named directory under the Fleetkeep app is a retained staging snapshot, not this maintenance checkout.

Keep the two operations GET-only, the approved Fleetkeep origin and read-only PKCE scopes. Never register an app, connect a customer account or publish a package merely to test dependency maintenance.

Use the official strict `n8n-node build` and `n8n-node lint` contract, then `npm test`. Community-node strict validation prohibits package dependency overrides and requires the standard ESLint configuration. Do not disable those rules or force incompatible SDK majors to make an audit appear clean.

17 November dependency candidate: official build parents refreshed to CLI 0.57.3, workflow 2.49.0 and TypeScript 5.9.3. Frozen install, complete graph, strict build/lint and six contract tests pass. Runtime code/icons/declarations match published 0.1.1 exactly; the generated distribution manifest differs only in development dependency versions. Production-only audit is zero, but 42 upstream development findings remain. This is not complete remediation and no package was republished. See `docs/dependency-audit-20261117/README.md`.
