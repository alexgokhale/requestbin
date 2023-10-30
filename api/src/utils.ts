import { Headers, ReturnedRequest, StoredRequest } from "./types";

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

export const mapRequest = (storedRequest: StoredRequest): ReturnedRequest => {
	return {
		id: storedRequest.id,
		method: storedRequest.method,
		ip: storedRequest.ip,
		url: storedRequest.url,
		timestamp: storedRequest.timestamp,
		headers: JSON.parse(storedRequest.headers) as Headers,
		body: storedRequest.body
	};
};
