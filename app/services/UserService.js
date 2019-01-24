import BackendService from './BackendService';

export default class UserService extends BackendService {

  update(user) {
    return this.request({
      url: 'profile',
      method: 'PUT',
      headers: this.getCommonHeaders(),
      content: {
        username: user.username
      },
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data }) => data);
  }

  changePassword(payload) {
    return this.request({
      url: 'change_password',
      method: 'POST',
      headers: this.getCommonHeaders(),
      content: payload,
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ success }) => success);
  }

  getProfile() {
    return this.request({
      url: 'profile',
      method: 'GET',
      headers: this.getCommonHeaders()
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data, token }) => ({ data, token }));
  }
}
