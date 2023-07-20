const axios = require('axios');
const fs = require('fs');

class TwitchAuth {
    static validationInterval = null;
    static lastValidation = 0;
    static tokenData = fs.existsSync('./data/token.json') ? JSON.parse(fs.readFileSync('./data/token.json')) : null;
    static clientId = 'd3eyzhfyndrvrh3yvhnjf5lrpi7fia'; // Replace with your Twitch client ID

    async getToken() {
        if (!TwitchAuth.tokenData || !(await this.validateToken())) {
            return await this.retrieveToken();
        }

        return TwitchAuth.tokenData.accessToken;
    }

    async validateToken(force = false) {
        if ((TwitchAuth.lastValidation + (60 * 60 * 1000) < Date.now()) || force) {
            const url = `https://id.twitch.tv/oauth2/validate`;

            try {
                const response = await axios.get(url, {
                    headers: {
                        'Client-ID': TwitchAuth.clientId,
                        'Authorization': `Bearer ${TwitchAuth.tokenData.accessToken}`
                    }
                });

                TwitchAuth.lastValidation = Date.now();
                return response.status == 200;
            } catch (e) {
                console.error('An error occurred while validating token:', e.stack);
                return false;
            }
        }

        if (TwitchAuth.tokenData && TwitchAuth.tokenData.expiresOn > Date.now()) {
            return true;
        }

        return false;
    }

    async retrieveToken() {
        console.log('Retrieving token...');

        const url = `https://id.twitch.tv/oauth2/token`;

        const body = new URLSearchParams();
        body.append('client_id', TwitchAuth.clientId);
        body.append('client_secret', '5id92abxt2t6fuxef27y7qoqxjnp9v'); // Replace with your Twitch client secret
        body.append('grant_type', 'client_credentials');

        const response = await axios.post(url, body);
        const data = response.data;

        TwitchAuth.tokenData = {
            accessToken: data.access_token,
            expiresOn: Date.now() + (data.expires_in * 1000)
        };

        fs.writeFileSync('./data/token.json', JSON.stringify(TwitchAuth.tokenData, null, 4));

        if (!(await this.validateToken(true))) {
            console.warn('Token is invalid, retrieving new token...');
            return await this.retrieveToken();
        }

        console.log('Token retrieved.');

        if (TwitchAuth.validationInterval) {
            clearInterval(TwitchAuth.validationInterval);
        }

        TwitchAuth.validationInterval = setInterval(async () => {
            await this.validateToken();
        }, 60 * 60 * 1000);

        return TwitchAuth.tokenData.accessToken;
    }
}

module.exports = TwitchAuth;
