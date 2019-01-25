<template>
  <GridLayout columns="*, auto" class="task-container" @swipe="onSwipe">
    <!-- Wrap in containers for bigger tap targets -->
    <GridLayout columns="auto, *" col="0" orientation="horizontal" class="tap-target">
      <Label col="0" :text="task.name" class="title"></Label>
    </GridLayout>
    <GridLayout col="1" class="delete-container" @tap="doDelete()">
      <StackLayout>
        <Image src="res://delete"></Image>
      </StackLayout>
    </GridLayout>
  </GridLayout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Schedule',
  props: {
    task: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      form: {
        name: this.task.name,
        description: this.task.description,
        id: this.task.id
      },
      scheduleForm: {
        id: 0,
        remarks: ''
      },
      remarks: '',
      showForm: false,
      showScheduleForm: false,
      busy: false
    };
  },
  computed: {
    ...mapGetters(['tasks']),
    formOk() {
      const { form: { name, description } } = this;
      return name.length >= 3 &&
        !this.tasks.some(t => name === t.name && t.description === description);
    },
    canMark() {
      return !!this.todaySchedule && !this.todaySchedule.done;
    },
    todaySchedule() {
      const today = new Date();
      today.setUTCHours(12, 0, 0, 0);

      return this.task.schedules
        .find(({ due_date }) => {
          const dueDate = new Date(due_date);
          return today.getFullYear() === dueDate.getFullYear() &&
            today.getMonth() === dueDate.getMonth() &&
            today.getDate() === dueDate.getDate();
        });
    }
  },
  methods: {
    ...mapActions(['deleteTask', 'updateTask', 'markTaskAsDone', 'updateSchedule']),
    toggleForm() {
      this.showForm = !this.showForm;
    },
    toggleScheduleForm() {
      this.showScheduleForm = !this.showScheduleForm;
      if (this.showScheduleForm && !!this.todaySchedule) this.scheduleForm.id = this.todaySchedule.id;
    },
    resetScheduleForm() {
      this.scheduleForm = { id: 0, remarks: '' };
    },
    onSwipe({ direction }) {
      // 1. Right
      // 2. Left
      console.info('onSwipe ' + direction);
    },
    doDelete() {
      if (this.busy) return;
      // if (!confirm('Are you sure?')) return; // Change to confirm dialog

      this.busy = true;

      this.deleteTask(this.task)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showFlash('Task deleted', 'success');
          } else {
            this.showFlash('Task not deleted', 'warning');
          }
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    },
    mark() {
      if (true) return;
      this.markTaskAsDone(this.task)
        .then((success) => {
          if (success) {
            if (this.scheduleForm.remarks.length) this.updateSchedule(this.scheduleForm);
            this.resetScheduleForm();
            this.toggleScheduleForm();
            this.showFlash('Done for today', 'success');
            return;
          }
          this.showFlash('Could not complete task', 'warning');
          this.resetScheduleForm();
        })
        .catch(({ message }) => this.showFlash(message, 'warning'));
    },
    update() {
      if (this.busy) return;
      this.busy = true;

      this.updateTask(this.form)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showFlash('Task updated', 'success');
          } else {
            this.showFlash('Task not updated', 'warning');
          }
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 30;
}
.platform-android .item-container {
  margin-top: 1;
}
.item-container {
  background-color: white;
  .visible {
    animation-name: show;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  .tap-target {
    padding-top: 13;
    padding-bottom: 13;
    padding-left: 16;
    label {
      min-width: 200;
    }
  }
  .check-box {
    margin-right: 10;
    height: 20;
  }
  .delete-container {
    padding: 10 15;
    vertical-align: middle;
    image {
      height: 20;
    }
    StackLayout {
      padding: 5;
    }
  }
}
</style>

