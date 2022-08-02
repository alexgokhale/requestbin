export interface Headers {
	[key: string]: string
}

export interface StoredRequest {
	id: string,
	ip: string
	method: string,
	url: string,
	timestamp: string,
	headers: Headers,
	body?: string
}

export interface Requests {
	[key: string]: StoredRequest
}

export interface RequestBin {
	id: string,
	requests: Requests
}
