import * as http from 'tns-core-modules/http';
import store from '@/store';

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService {
  constructor() {
    this.baseUrl = 'http://0612ab0c.ngrok.io/api/v1/';
    this.debug = process.env.NODE_ENV !== 'production';
  }

  validateCode(response) {
    return new Promise((resolve, reject) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        resolve(response);
      } else {
        // console.error('Response code: ' + response.statusCode +
        //   '\nContent: ' + response.content.toString());
        reject(response);
      }
    })
  }

  getJson(response) {
    return new Promise((resolve, reject) => {
      // if (this.debug) console.log('Content: ' + response.content.toString());
      resolve(response.content.toJSON());
    })
      .catch(e => {
        console.error('Error parsing JSON response: ' + e);
        throw 'Error parsing JSON response: ' + e;
      })
  }

  getCommonHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.getters.token}`
    };
  }

  request(params) {
    params.url = `${this.baseUrl}${params.url}`;
    if (!!params.content) params.content = JSON.stringify(params.content);
    return http.request(params);
  }
}
