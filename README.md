# Fleetkeep for n8n

Read vehicles and maintenance tasks from your Fleetkeep account. Use the results in workflows you control, such as preparing a maintenance review for your team.

Published on npm. Verification by n8n is pending; this is not a verified community node. Production OAuth and both read operations have passed in n8n 2.45.4 using a confirmed fictional marketplace account. AI-agent execution remains unverified.

## Operations

| Resource | Operation | Result |
| --- | --- | --- |
| Vehicle | Get Many | The API's `vehicles` array and any completeness metadata |
| Maintenance | Get Many | Open tasks and recent completed history in `open` and `recent` |

Each operation returns the full response as one item. Inspect `truncated` when provided. The live API currently omits it, so the example reports completeness as unknown instead of assuming a complete fleet. Maintenance history is the API's recent history, not a complete archive. This version has no write operations.

## Credentials

Fleetkeep uses OAuth authorisation-code flow with S256 PKCE. There is no API key to paste. Create a Fleetkeep OAuth2 API credential and enter a client ID registered by Fleetkeep for your n8n instance's exact callback URL. The test used a dedicated loopback-only QA client, disabled after testing with refresh access revoked. There is no shared general-purpose client.

The fixed scopes are `vehicles:read maintenance:read offline_access`. The account owner signs in to Fleetkeep and reviews consent. Tokens are stored by n8n's credential system; do not paste them into node parameters or exported workflows. Refresh access is subject to the server's expiry and revocation rules. Already issued JWT access tokens can remain valid until expiry after refresh revocation; protect and remove test credential copies. Client registration is required before an authenticated workflow can run.

Calls go only to `https://fleetkeep.co.uk/api/v1`. n8n receives the account data you authorise. Review your n8n hosting and any downstream destinations before connecting a real account. The node declares AI-agent tool support with the same read-only operations and scopes; model-driven execution has not yet been verified.

## Example workflow

Import `examples/maintenance-review.json`. Select your Fleetkeep credential in both Fleetkeep nodes and execute manually. It reads vehicles and maintenance, then prepares a summary containing registrations, open-task titles, dates and priority. It does not email anyone, change Fleetkeep or call an AI model.

Test first with a fictional QA account. Missing due dates stay null; a truncated vehicle list produces a warning. A downstream failure must not be treated as a successful empty fleet.

## Local development

Use Node.js 22.22 or newer:

```sh
npm ci --ignore-scripts
npm run build
npm run lint
npm test
npm pack --dry-run
```

The package has no external runtime dependencies. The development toolchain is separate and must pass release review before publication. Local n8n 2.45.4 fixture checks passed for both reads, PKCE, refresh, denied consent, empty/truncated data and 403/429 responses. The test used a loopback authorisation endpoint; separate production OAuth and vehicle/maintenance checks also passed through n8n with fictional data. The current official development toolchain has 23 audit findings (19 high, 4 moderate); these are not runtime dependencies. Review upstream fixes before building with untrusted inputs.

API documentation: https://fleetkeep.co.uk/developers

## Support

Report the operation and error status to jl@fleetkeep.co.uk. Do not include tokens, client secrets or customer vehicle records.
