export interface Headers {
	[key: string]: string
}

export interface StoredRequest {
	id: string;
	bin_id: string
	ip: string
	method: string
	url: string
	timestamp: number
	headers: string
	body?: ArrayBuffer
}

export interface ReturnedRequest {
	id: string
	ip: string
	method: string
	url: string
	timestamp: number
	headers: Headers
	body?: ArrayBuffer
}

export interface Requests {
	[key: string]: ReturnedRequest
}

export interface RequestBin {
	id: string
	requests: Requests
}
