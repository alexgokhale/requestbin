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
    body?: number[]
}

export interface Requests {
    [key: string]: StoredRequest
}

export interface RequestBin {
    id: string,
    requests: Requests
}

export interface RequestBinResponse {
    success: boolean,
    bin: RequestBin
}

export interface ErrorResponse {
    success: boolean,
    message: string
}
