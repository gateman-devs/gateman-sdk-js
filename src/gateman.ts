import {
    APIResponse,
    GatemanConfig,
    TokenPayload
} from './types';
import { generatePKCEPair } from './auth/pkce';
import { WindowManager } from './auth/window-manager';
import { OAUTH_APP_URL, BACKEND_URL } from './constants';

/**
 * GatemanSSO - Simple authentication SDK
 * Uses promise-based flow for authentication
 */
export class GatemanSSO {
    private windowManager: WindowManager;

    constructor(private config: GatemanConfig) {
        this.windowManager = new WindowManager();
    }

    /**
     * Initiate authentication flow
     * Opens popup and waits for authentication to complete
     * @returns Promise that resolves with authentication response containing the token
     */
    async login(): Promise<TokenPayload> {
        try {
            // Generate PKCE challenge first
            const { challenge } = await generatePKCEPair();

            // Build authentication URL
            const authUrl = this.buildAuthUrl(challenge, window.location.origin);

            // Open popup immediately and navigate to auth URL
            // The popup opens with a loading screen, then navigates to the auth URL
            // This happens synchronously to avoid popup blockers
            const authMessage = await this.windowManager.openAuthWindow(
                authUrl,
            );

            // Check if authentication was successful
            if (!authMessage.success) {
                throw new Error(
                    authMessage.error || 'Authentication failed'
                );
            }

            // Fetch the token from the API using the code challenge
            const token = await this.fetchToken(challenge);

            return token;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Authentication failed');
        }
    }

    /**
     * Build authentication URL with parameters
     */
    private buildAuthUrl(codeChallenge: string, allowedOrigin: string): string {
        const params = new URLSearchParams({
            app_id: this.config.appID,
            code_challenge: codeChallenge,
            origin: allowedOrigin,
        });

        const baseUrl = OAUTH_APP_URL;
        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * Fetch token from API using code challenge
     */
    private async fetchToken(codeChallenge: string): Promise<TokenPayload> {
        try {
            const baseUrl = BACKEND_URL;
            const response = await fetch(
                baseUrl + '/api/public/v1/app/code-challenge/payload?code_challenge=' + codeChallenge
            );

            if (response.status >= 200 && response.status < 300) {
                const responseData = await response.json() as APIResponse<TokenPayload>
                console.log(responseData.message)
                const payload = responseData?.body?.payload;

                if (!payload) {
                    throw new Error('Invalid token response from server');
                }

                return { payload }
            } else {
                throw new Error('Failed to retrieve token: ' + response.statusText);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch authentication token');
        }
    }
}
