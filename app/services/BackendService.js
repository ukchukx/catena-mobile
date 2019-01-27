import * as http from 'tns-core-modules/http';
import store from '@/store';

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService {
  constructor() {
    this.baseUrl = 'http://192.168.8.100:3333/api/v1/';
  }

  validateCode(response) {
    return new Promise((resolve, reject) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        resolve(response);
      } else {
        // console.error('Response code: ' + response.statusCode +
        //   '\nContent: ' + response.content.toString());
        reject(response.content.toJSON());
      }
    })
  }

  getJson(response) {
    return new Promise((resolve, reject) => {
      // console.log('Content: ' + response.content.toString());
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
    params.timeout = params.timeout ? params.timeout : 20000;
    if (!!params.content) params.content = JSON.stringify(params.content);
    return http.request(params);
  }
}
