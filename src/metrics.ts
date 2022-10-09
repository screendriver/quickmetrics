import * as actionsCore from '@actions/core';
import { Got } from 'got';

interface QuickmetricsResponse {
	error?: string;
}

interface SendMetricsArguments {
	name: string;
	apiKey: string;
	value: number;
	dimension?: string;
	got: Got;
	core: typeof actionsCore;
}

export function sendToQuickmetrics({
	got,
	apiKey,
	name,
	value,
	dimension,
}: SendMetricsArguments) {
	return got
		.post('https://qckm.io/json', {
			headers: {
				'x-qm-key': apiKey,
			},
			json: {
				name,
				value,
				dimension,
			},
		})
		.json<QuickmetricsResponse>();
}

export function logResponse(core: typeof actionsCore) {
	return ({ error }: QuickmetricsResponse) => {
		if (error) {
			core.setFailed(error);
		} else {
			core.info('Metrics sent');
		}
	};
}
