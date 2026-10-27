import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FleetkeepOAuth2Api implements ICredentialType {
	name = 'fleetkeepOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Fleetkeep OAuth2 API';
	icon = { light: 'file:fleetkeep.svg', dark: 'file:fleetkeep.svg' } as const;
	documentationUrl = 'https://fleetkeep.co.uk/developers';
	properties: INodeProperties[] = [
		{ displayName: 'Grant Type', name: 'grantType', type: 'hidden', default: 'pkce' },
		{ displayName: 'Authorization URL', name: 'authUrl', type: 'hidden', default: 'https://fleetkeep.co.uk/auth/oauth2/authorize' },
		{ displayName: 'Access Token URL', name: 'accessTokenUrl', type: 'hidden', default: 'https://fleetkeep.co.uk/auth/oauth2/token' },
		{ displayName: 'Client Secret', name: 'clientSecret', type: 'hidden', typeOptions: { password: true }, default: '' },
		{ displayName: 'Scope', name: 'scope', type: 'hidden', default: 'vehicles:read maintenance:read offline_access' },
		{ displayName: 'Auth URI Query Parameters', name: 'authQueryParameters', type: 'hidden', default: 'resource=https%3A%2F%2Ffleetkeep.co.uk%2Fapi' },
		{ displayName: 'Authentication', name: 'authentication', type: 'hidden', default: 'body' },
	];
}
