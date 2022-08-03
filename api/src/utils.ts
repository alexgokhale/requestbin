const DEFAULT_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const randomString = (length: number, characters?: string): string => {
	let charactersToUse = DEFAULT_CHARACTERS;

	if (characters)
		charactersToUse = characters;

	let result = "";

	for (let i = 0; i < length; i++)
		result += charactersToUse.charAt(Math.floor(Math.random() * charactersToUse.length));

	return result;
};

export const json = (body: object, options: ResponseInit = {}): Response => {
	const { headers = {}, ...rest } = options;

	return new Response(JSON.stringify(body), {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,HEAD,TRACE,CONNECT,OPTIONS",
			...headers
		},
		...rest
	});
};
