import BackendService from './BackendService';

export default class AuthService extends BackendService {

  login(user) {
    return this.request({
      url: 'authenticate',
      method: 'POST',
      headers: this.getCommonHeaders(),
      content: {
        email: user.email,
        password: user.password
      },
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data, token: { token } }) => {
        console.info(`Token: ${this.token}`);
        this.token = token;
        return { data, token };
      });
  }

  signup(user) {
    return this.request({
      url: 'signup',
      method: 'POST',
      headers: this.getCommonHeaders(),
      content: {
        email: user.email,
        password: user.password
      },
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data, token: { token } }) => {
        console.info(`Token: ${this.token}`);
        this.token = token;
        return { data, token };
      });
  }

  logout() {
    this.token = '';
  }
}
