/**
 * Gateman Node.js SDK
 * Official SDK for integrating Gateman SSO authentication
 */

// Main SDK class
export { GatemanSSO } from './gateman';

// Types
export type {
    GatemanConfig,
    AuthError,
    UserInfo,
    TokenPayload,
    AuthMessage,
} from './types';



// Utilities
export { generateCodeVerifier, generateCodeChallenge, generatePKCEPair } from './auth/pkce';

// Default export
export { GatemanSSO as default } from './gateman';
