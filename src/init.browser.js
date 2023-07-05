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