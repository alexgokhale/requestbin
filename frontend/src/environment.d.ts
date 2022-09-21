declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_BASE_API_URL: string;
        }
    }
}

export {};
