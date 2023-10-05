const axios = require('axios');


class AllegroApi{
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.apiKey = null; // Store the API key here after obtaining it
        this.tokenExpiration = null; // Store the token expiration date/time here
        this.baseUrl = 'https://api.allegro.pl/';
        this.headers = {
          'Accept': 'application/vnd.allegro.public.v1+json',
        };
      }
    
      async getToken() {
        try {
          const tokenResponse = await axios.post(
            'https://allegro.pl/auth/oauth/token',
            `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
    
          this.apiKey = tokenResponse.data.access_token;
          this.tokenExpiration = new Date().getTime() + tokenResponse.data.expires_in * 1000;
    
          return this.apiKey;
        } catch (error) {
          throw error;
        }
      }

      async getOfferList() {
        if (!this.apiKey || this.tokenExpiration <= new Date().getTime()) {
          await this.getToken();
        }
    
        try {
          const response = await axios.get(`${this.baseUrl}offers/listing`, {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              ...this.headers,
            },
          });
    
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    }

module.exports = AllegroApi;

