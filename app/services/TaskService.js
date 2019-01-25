import BackendService from './BackendService';

export default class TaskService extends BackendService {

  create(task) {
    return this.request({
      url: 'tasks',
      method: 'POST',
      headers: this.getCommonHeaders(),
      content: task,
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data }) => data);
  }

  update(payload) {
    return this.request({
      url: `tasks/${id}`,
      method: 'PUT',
      headers: this.getCommonHeaders(),
      content: payload,
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data }) => data);
  }

  getTasks() {
    return this.request({
      url: 'tasks',
      method: 'GET',
      headers: this.getCommonHeaders()
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data }) => data);
  }

  getTask(id) {
    return this.request({
      url: `tasks/${id}`,
      method: 'GET',
      headers: this.getCommonHeaders()
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data }) => data);
  }

  deleteTask(id) {
    return this.request({
      url: `tasks/${id}`,
      method: 'DELETE',
      headers: this.getCommonHeaders()
    })
      .then(this.validateCode)
      .then(() => true);
  }

  markTask(id) {
    return this.request({
      url: `tasks/${id}/done`,
      method: 'POST',
      headers: this.getCommonHeaders()
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data }) => data);
  }

  updateSchedule(schedule) {
    return this.request({
      url: `tasks/update_schedule/${schedule.id}`,
      method: 'PUT',
      headers: this.getCommonHeaders(),
      content: { remarks: schedule.remarks },
    })
      .then(this.validateCode)
      .then(this.getJson)
      .then(({ data }) => data);
  }
}
