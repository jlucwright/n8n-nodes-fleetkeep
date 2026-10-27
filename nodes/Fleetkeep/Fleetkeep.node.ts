import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

export class Fleetkeep implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fleetkeep',
		name: 'fleetkeep',
		icon: { light: 'file:fleetkeep.svg', dark: 'file:fleetkeep.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Read vehicles and maintenance tasks from Fleetkeep',
		defaults: { name: 'Fleetkeep' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'fleetkeepOAuth2Api', required: true }],
		requestDefaults: {
			baseURL: 'https://fleetkeep.co.uk/api/v1',
			headers: { Accept: 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource', name: 'resource', type: 'options', noDataExpression: true,
				options: [{ name: 'Maintenance', value: 'maintenance' }, { name: 'Vehicle', value: 'vehicle' }],
				default: 'vehicle',
			},
			{
				displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
				displayOptions: { show: { resource: ['vehicle'] } },
				options: [{ name: 'Get Many', value: 'getAll', action: 'Get vehicles', description: 'Read authorised vehicles and the API truncation flag', routing: { request: { method: 'GET', url: '/vehicles' } } }],
				default: 'getAll',
			},
			{
				displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
				displayOptions: { show: { resource: ['maintenance'] } },
				options: [{ name: 'Get Many', value: 'getAll', action: 'Get maintenance tasks', description: 'Read open maintenance tasks and recent completed history', routing: { request: { method: 'GET', url: '/operations/maintenance' } } }],
				default: 'getAll',
			},
		],
	};
}
