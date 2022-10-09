import * as core from "@actions/core";
import got from "got";
import pipe from "p-pipe";
import { sendToQuickmetrics, logResponse } from "./metrics";

async function run() {
	const name = core.getInput("name", { required: true });
	const apiKey = core.getInput("api-key", { required: true });
	const value = core.getInput("value", { required: false });
	const dimension = core.getInput("dimension", { required: false });
	try {
		const args = {
			name,
			apiKey,
			value: parseFloat(value),
			dimension,
			got,
			core,
		};
		await pipe(sendToQuickmetrics, logResponse(core))(args);
	} catch (error) {
		core.setFailed(JSON.stringify(error));
	}
}

void run();
