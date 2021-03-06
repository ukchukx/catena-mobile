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
      .then((data) => {
        commit(SAVE_USER, data);
        resolve(true);
      })
      .catch((error) => {
        console.error(['fetchProfile', error]);
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
        console.error(['updateProfile', error]);
        reject(error);
      });
  });
}

export function changePassword(store, payload) {
  return new Promise((resolve, reject) => {
    userService
      .changePassword(payload)
      .then((success) => resolve(success))
      .catch((error) => {
        console.error(['changePassword', error]);
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
        console.error(['signup', error]);
        reject(error);
      });
  });
}

export function authenticate({ commit }, payload) {
  return new Promise((resolve, reject) => {
    authService
      .login(payload)
      .then(({ data, token }) => {
        commit(SAVE_USER, data);
        commit(SAVE_TOKEN, token);
        resolve(true);
      })
      .catch((error) => {
        console.error(['authenticate', error]);
        reject(error);
      });
  });
}

export function deleteUser({ commit }) {
  commit(SAVE_USER, {});
  commit(SAVE_TOKEN, '');
  commit(SAVE_TASKS, []);
}

export function createTask({ commit }, payload) {
  return new Promise((resolve, reject) => {
    taskService
      .create(payload)
      .then((data) => {
        commit(SAVE_TASK, data);
        resolve(true);
      })
      .catch((error) => {
        console.error(['createTask', error]);
        reject(error);
      });
  });
}

export function markTaskAsDone({ commit }, task) {
  return new Promise((resolve, reject) => {
    taskService
      .markTask(task.id)
      .then((data) => {
        commit(SAVE_TASK, data);
        resolve(true);
      })
      .catch((error) => {
        console.error(['markTaskAsDone', error]);
        reject(error);
      });
  });
}

export function fetchTasks({ commit }) {
  return new Promise((resolve, reject) => {
    taskService
      .getTasks()
      .then((data) => {
        commit(SAVE_TASKS, data);
        resolve(true);
      })
      .catch((error) => {
        console.error(['fetchTasks', error]);
        reject(error);
      });
  });
}

export function updateTask({ commit }, task) {
  return new Promise((resolve, reject) => {
    taskService
      .update(task)
      .then((data) => {
        commit(SAVE_TASK, data);
        resolve(true);
      })
      .catch((error) => {
        console.error(['updateTask', error]);
        reject(error);
      });
  });
}

export function deleteTask({ commit }, task) {
  const id = typeof task === 'object' ? task.id : task;
  return new Promise((resolve, reject) => {
    taskService
      .deleteTask(id)
      .then((success) => {
        commit(DELETE_TASK, id);
        resolve(success);
      })
      .catch((error) => {
        console.error(['deleteTask', error]);
        reject(error);
      });
  });
}

export function updateSchedule({ commit }, schedule) {
  return new Promise((resolve, reject) => {
    taskService
      .updateSchedule(schedule)
      .then((data) => {
        commit(SAVE_SCHEDULE, data);
        resolve(true);
      })
      .catch((error) => {
        console.error(['updateSchedule', error]);
        reject(error);
      });
  });
}
