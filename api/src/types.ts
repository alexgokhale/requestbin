export interface Headers {
	[key: string]: string
}

export interface StoredRequest {
	id: string,
	ip: string
	method: string,
	url: string,
	timestamp: number,
	headers: Headers,
	body?: Uint8Array
}

export interface Requests {
	[key: string]: StoredRequest
}

export interface RequestBin {
	id: string,
	requests: Requests
}
