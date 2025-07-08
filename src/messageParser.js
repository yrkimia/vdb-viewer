export const parseMessage = (message) => {
    try {
        const parsed = JSON.parse(message);

        console.log('Raw message:', message);
        console.log('Parsed message:', parsed);

        // Example: Server sends JSON in the format { type, status, data }
        switch (parsed.type) {
            case 'success':
                return {
                    type: 'success',
                    message: parsed.message || 'Operation successful',
                    data: parsed.data || [],
                };

            case 'error':
                return {
                    type: 'error',
                    error: parsed.error || 'Unknown error occurred',
                };

            default:
                return {
                    type: 'unknown',
                    raw: message,
                };
        }
    } catch (e) {
        return {
            type: 'invalid',
            raw: message,
            error: 'Failed to parse message',
        };
    }
};
