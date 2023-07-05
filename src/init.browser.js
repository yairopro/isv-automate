async function graphql(body, auth) {
	const response = await fetch("https://api.smoteo.com/graphql", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"authorization": "Bearer " + auth.access_token,
			"x-tenant-id": "christiandior"
		},
		body: JSON.stringify(body),
	});

	return {
		ok: response.ok,
		status: response.status,
		body: response.ok ? response.json() : undefined,
	};
}

window.graphql = graphql;

async function strictFetch(...params) {
	const response = await fetch(...params);
	if (!response.ok) {
		console.error(response.status, ' ', response.statusText);
		throw new FetchError(response);
	}
}


class FetchError extends Error {
	constructor(response) {
		super(response.statusText);
		this.response = response;
	}
}