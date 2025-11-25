/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0
 * Implements RFC 7636
 */

/**
 * Generate a cryptographically random code verifier
 * @returns Base64 URL-encoded random string
 */
export function generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    return btoa(String.fromCharCode(...window.crypto.getRandomValues(array)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');;
}

/**
 * Generate code challenge from code verifier using SHA-256
 * @param verifier - The code verifier
 * @returns Base64 URL-encoded SHA-256 hash of the verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    let hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer))).replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate both verifier and challenge
 * @returns Object containing verifier and challenge
 */
export async function generatePKCEPair(): Promise<{ verifier: string; challenge: string }> {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    return { verifier, challenge };
}
