import puppeteer from "puppeteer";
import { Node } from "graph-fs"


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

	await page.evaluate(initJs);
	function graphql(query: object): Promise<any> {
		// @ts-ignore
		return page.evaluate((query, auth) => window.graphql(query, auth), query, auth);
	}


	const response = await graphql({ query: "{__typename}" });
	console.log(response);

}

main();

const initJsFile = new Node(__dirname).resolve("init.browser.js");
const initJs = initJsFile.getContent();