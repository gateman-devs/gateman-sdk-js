import { StringifyOptions } from "querystring";

/**
 * Configuration options for initializing the Gateman SDK
 */
export interface GatemanConfig {
    appID: string;
}


/**
 * User information returned after authentication
 */
export interface UserInfo {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    [key: string]: any;
}

/**
 * Authentication error details
 */
export interface AuthError {
    /** Error code */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Additional error details */
    details?: any;
}

export interface APIResponse<T> {
    body: T;
    message: string;
    errors?: string[];
}

export interface TokenPayload {
    payload: {
        accessToken: string
        encryptedData: string
        refreshToken: StringifyOptions
    }
}

/**
 * Message sent from auth popup to parent window
 */
export interface AuthMessage {
    success: boolean;
    error?: string;
    data?: any;
}

/**
 * Network request options
 */
export interface NetworkOptions {
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: any;
    timeout?: number;
}

/**
 * Base API response structure
 */
export interface BaseResponse<T> {
    body?: T;
    message: string;
    errors?: string[];
}

/**
 * API response wrapper
 */
export interface Response<T> {
    body: BaseResponse<T>;
    status: number;
}
