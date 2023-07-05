import fetch, { Response } from "node-fetch";
import puppeteer from "puppeteer";


async function main() {
	const browser = await puppeteer.launch({
		headless: false,

		channel: "chrome",
		// executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google Chrome',
		args: [
			`--user-data-dir=${__dirname}/chrome_profile`,
			'--profile-directory=Default',
			// "--disable-web-security",
			// "--user-data-dir=~/Library/Application\ Support/Google/Chrome"
		],
	});

	const [page] = await browser.pages();
	await page.goto('https://christiandior.smoteo.com/me/timesheets/');
	const authResponse = await page.waitForResponse(response =>
		response.request().method().toUpperCase() == "POST" &&
		response.url().startsWith("https://securetoken.googleapis.com/v1/token"),
		{ timeout: 5 * 60 * 1000 }
	);


	const auth = await authResponse.json();

	// await page.evaluate(initJs);
	// function graphql(query: object): Promise<any> {
	// 	// @ts-ignore
	// 	return page.evaluate((query, auth) => window.graphql(query, auth), query, auth);
	// }


	// const response = await graphql({ query: "{__typename}" });
	const response = await graphql({ query: "{__typename}" }, auth);
	console.log(response);

}

main();

async function graphql(body: object, auth: any) {
	const repsonse = await strictFetch("https://api.smoteo.com/graphql", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"authorization": "Bearer " + auth.access_token,
			"x-tenant-id": "christiandior"
		},
		body: JSON.stringify(body),
	});

	return repsonse.json();
}



async function strictFetch(...params: readonly any[]): Promise<Response> {
	// @ts-ignore
	const response = await fetch(...params);

	if (!response.ok) {
		console.error(response.status, ' ', response.statusText);
		throw new FetchError(response);
	}

	return response;
}


class FetchError extends Error {
	public response: Response;

	constructor(response: Response) {
		super(response.statusText);
		this.response = response;
	}
}