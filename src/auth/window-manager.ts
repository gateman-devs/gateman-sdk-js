import { OAUTH_APP_URL } from '../constants';
import { AuthMessage } from '../types';

/**
 * Manages authentication popup window
 */
export class WindowManager {
    private popup: Window | null = null;
    private messageListener: ((event: MessageEvent) => void) | null = null;
    private checkInterval: number | null = null;
    private timeout = 300000

    /**
     * Open authentication popup window
     * @param urlFactory - Function that returns the authentication URL (can be async)
     * @returns Promise that resolves when authentication completes
     */
    async openAuthWindow(
        urlFactory: string | (() => string | Promise<string>),
    ): Promise<AuthMessage> {
        return new Promise(async (resolve, reject) => {
            // Calculate popup dimensions and position
            const width = 500;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            // Open popup IMMEDIATELY with blank page to avoid popup blockers
            // We'll navigate to the auth URL once it's ready
            this.popup = window.open(
                'about:blank',
                'gateman_auth',
                `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
            );

            // Check if popup was blocked
            if (!this.popup || this.popup.closed) {
                reject(new Error('Authentication popup was blocked by the browser'));
                return;
            }

            // Get the URL (either directly or from factory function)
            const url = typeof urlFactory === 'function'
                ? await urlFactory()
                : urlFactory;

            // Navigate the popup to the auth URL
            this.popup.location.href = url;

            // Set up timeout
            const timeoutId = setTimeout(() => {
                this.cleanup();
                reject(new Error('Authentication request timed out'));
            }, this.timeout);


            // Set up message listener
            this.messageListener = (event: MessageEvent) => {
                // Verify origin
                if (event.origin !== OAUTH_APP_URL) {
                    console.warn(`Received message from unauthorized origin: ${event.origin}`);
                    return;
                }

                const message = event.data as AuthMessage;

                // Handle authentication result
                if (message.success !== undefined) {
                    clearTimeout(timeoutId);
                    this.cleanup();

                    if (message.success) {
                        resolve(message);
                    } else {
                        reject(new Error(message.error || 'Authentication failed'));
                    }
                }
            };

            window.addEventListener('message', this.messageListener);

            // Check if popup was closed manually
            this.checkInterval = window.setInterval(() => {
                if (this.popup && this.popup.closed) {
                    clearTimeout(timeoutId);
                    this.cleanup();
                    reject(new Error('Authentication popup was closed'));
                }
            }, 500);
        });
    }

    /**
     * Clean up popup and listeners
     */
    private cleanup(): void {
        // Remove message listener
        if (this.messageListener) {
            window.removeEventListener('message', this.messageListener);
            this.messageListener = null;
        }

        // Clear interval
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }

        // Close popup if still open
        if (this.popup && !this.popup.closed) {
            this.popup.close();
        }
        this.popup = null;
    }

    /**
     * Manually close the popup
     */
    close(): void {
        this.cleanup();
    }
}
