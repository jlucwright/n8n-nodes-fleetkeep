const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { Fleetkeep } = require('../dist/nodes/Fleetkeep/Fleetkeep.node.js');
const { FleetkeepOAuth2Api } = require('../dist/credentials/FleetkeepOAuth2Api.credentials.js');
const workflow = JSON.parse(fs.readFileSync(require.resolve('../examples/maintenance-review.json')));
const node = new Fleetkeep().description;
const credential = new FleetkeepOAuth2Api();

test('all shipped operations stay GET-only on the approved Fleetkeep origin', () => {
  assert.equal(node.requestDefaults.baseURL, 'https://fleetkeep.co.uk/api/v1');
  const routes = node.properties.filter(p => p.name === 'operation').flatMap(p => p.options.map(o => o.routing.request));
  assert.equal(routes.length, 2);
  for (const route of routes) {
    assert.equal(route.method, 'GET');
    assert.ok(['/vehicles', '/operations/maintenance'].includes(route.url));
    assert.equal(new URL(route.url, 'https://fleetkeep.co.uk').origin, 'https://fleetkeep.co.uk');
  }
  assert.ok(node.credentials[0].required);
});

test('credentials require PKCE, read-only scopes and no hard-coded client secret', () => {
  const fields = Object.fromEntries(credential.properties.map(p => [p.name, p.default]));
  assert.equal(fields.grantType, 'pkce');
  assert.deepEqual(fields.scope.split(' ').sort(), ['maintenance:read', 'offline_access', 'vehicles:read']);
  assert.equal(fields.clientSecret, '');
  assert.equal(fields.authentication, 'body');
  assert.equal(fields.authUrl, 'https://fleetkeep.co.uk/auth/oauth2/authorize');
  assert.equal(fields.accessTokenUrl, 'https://fleetkeep.co.uk/auth/oauth2/token');
  assert.equal(new URLSearchParams(fields.authQueryParameters).get('resource'), 'https://fleetkeep.co.uk/api');
});

const code = workflow.nodes.find(n => n.type === 'n8n-nodes-base.code').parameters.jsCode;
function summary(fleet, maintenance) {
  return JSON.parse(JSON.stringify(vm.runInNewContext(`(function(){${code}})()`, {
    $: name => { assert.equal(name, 'Get vehicles'); return { first: () => ({ json: fleet }) }; },
    $input: { first: () => ({ json: maintenance }) },
  })));
}

test('example preserves incomplete-list warnings and missing due dates', () => {
  const result = summary({ vehicles: [{ registration: 'QA26 ABC' }], truncated: true }, {
    open: [{ registration: 'QA26 ABC', title: 'Fictional inspection', priority: 'normal', dueDate: null }], recent: [],
  })[0].json;
  assert.equal(result.completeVehicleList, false);
  assert.match(result.warning, /truncated/);
  assert.equal(result.openTasks[0].dueDate, null);
  assert.equal(result.vehicleCountReturned, 1);
});

test('example rejects malformed API responses instead of inventing an empty fleet', () => {
  assert.throws(() => summary({ error: 'unauthorised' }, { open: [], recent: [] }), /Unexpected Fleetkeep response/);
  assert.throws(() => summary({ vehicles: [], truncated: false }, { error: 'unauthorised' }), /Unexpected Fleetkeep response/);
  const empty = summary({ vehicles: [], truncated: false }, { open: [], recent: [] })[0].json;
  assert.equal(empty.completeVehicleList, true);
  assert.deepEqual(empty.openTasks, []);
});

test('example cannot send messages, write records or export credentials', () => {
  assert.equal(workflow.active, false);
  assert.equal(workflow.nodes.length, 4);
  for (const n of workflow.nodes) {
    assert.ok(['n8n-nodes-base.manualTrigger', 'n8n-nodes-fleetkeep.fleetkeep', 'n8n-nodes-base.code'].includes(n.type));
    assert.equal(n.credentials, undefined);
  }
  assert.doesNotMatch(code, /fetch\(|httpRequest|require\(|process\./);
});

test('live vehicle responses without completeness metadata remain usable without claiming completeness', () => {
 const result = summary({ vehicles: [{ registration: 'QA26VAN' }] }, { open: [], recent: [] })[0].json;
 assert.equal(result.vehicleCountReturned, 1);
 assert.equal(result.completeVehicleList, null);
 assert.match(result.warning, /does not report/);
});
