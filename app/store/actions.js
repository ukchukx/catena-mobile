import {
  SAVE_USER,
  SAVE_TOKEN,
  SAVE_TASKS,
  SAVE_TASK,
  DELETE_TASK,
  SAVE_SCHEDULE
} from './mutation-types';
import TaskService from '@/services/TaskService';
import AuthService from '@/services/AuthService';
import UserService from '@/services/UserService';

const taskService = new TaskService();
const authService = new AuthService();
const userService = new UserService();


export function fetchProfile({ commit }) {
  return new Promise((resolve, reject) => {
    userService
      .getProfile()
      .then(({ data, token }) => {
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
        resolve(true);
      })
      .catch((error) => {
        console.log('fetchProfile', error);
        reject(error);
      });
  });
}

export function updateProfile({ commit }, payload) {
  return new Promise((resolve, reject) => {
    userService
      .update(payload)
      .then((data) => {
        commit(SAVE_USER, data);
        resolve(true);
      })
      .catch((error) => {
        console.log('updateProfile', error);
        reject(error);
      });
  });
}

export function changePassword(store, payload) {
  return new Promise((resolve, reject) => {
    userService
      .changePassword(payload)
      .then((success) => {
        resolve(success);
      })
      .catch((error) => {
        console.log('changePassword', error);
        reject(error);
      });
  });
}

export function signup({ commit }, payload) {
  return new Promise((resolve, reject) => {
    authService
      .signup(payload)
      .then(({ data, token }) => {
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
        resolve(true);
      })
      .catch((error) => {
        console.log('signup', error);
        reject(error);
      });
  });
}

export function authenticate({ commit }, payload) {
  return new Promise((resolve, reject) => {
    authService
      .login(payload)
      .then(({ data, token }) => {
        console.log('save user and token');
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
        resolve(true);
      })
      .catch((error) => {
        console.log('authenticate');
        console.error(error);
        reject(error);
      });
  });
}

export function deleteUser({ commit }) {
  authService.logout();
  commit(SAVE_USER, {});
  commit(SAVE_TOKEN, '');
  commit(SAVE_TASKS, []);
}

export function createTask({ commit }, payload) {
  return new Promise((resolve, reject) => {
    taskService
      .createTask(payload)
      .then(({ data }) => {
        commit(SAVE_TASK, data);
        resolve(true);
      })
      .catch((error) => {
        console.log('createTask', error);
        reject(error);
      });
  });
}

export function markTaskAsDone({ commit }, task) {
  return new Promise((resolve, reject) => {
    taskService
      .markTask(task.id)
      .then(({ data }) => {
        commit(SAVE_TASK, data);
        resolve(true);
      })
      .catch((error) => {
        console.log('markTaskAsDone', error);
        reject(error);
      });
  });
}

export function fetchTasks({ commit }) {
  return new Promise((resolve, reject) => {
    taskService
      .getTasks()
      .then(({ data }) => {
        commit(SAVE_TASKS, data);
        resolve(true);
      })
      .catch((error) => {
        console.log('fetchTasks', error);
        reject(error);
      });
  });
}

export function updateTask({ commit }, task) {
  return new Promise((resolve, reject) => {
    taskService
      .update(task)
      .then(({ data }) => {
        commit(SAVE_TASK, data);
        resolve(true);
      })
      .catch((error) => {
        console.log('updateTask', error);
        reject(error);
      });
  });
}

export function deleteTask({ commit }, task) {
  const id = typeof task === 'object' ? task.id : task;
  return new Promise((resolve, reject) => {
    taskService
      .deleteTask(id)
      .then(() => {
        commit(DELETE_TASK, id);
        resolve(true);
      })
      .catch((error) => {
        console.log('deleteTask', error);
        reject(error);
      });
  });
}

export function updateSchedule({ commit }, schedule) {
  return new Promise((resolve, reject) => {
    taskService
      .updateSchedule(schedule)
      .then(({ data }) => {
        commit(SAVE_SCHEDULE, data);
        resolve(true);
      })
      .catch((error) => {
        console.log('updateSchedule', error);
        reject(error);
      });
  });
}
