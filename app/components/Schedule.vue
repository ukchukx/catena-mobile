<template>
  <GridLayout
    columns="*, auto"
    rows="*, auto"
    class="task-container"
    @tap="toggleForm()"
    @swipe="onSwipe"
  >
    <Label col="0" row="0" :text="task.name" class="title"></Label>
    <Label v-if="canMark" col="1" row="0" :text="'\uf0e7'" class="fa title bell"></Label>
    <GridLayout row="1">
      <StackLayout class="form" v-if="showForm">
        <StackLayout class="input-field">
          <Label text="Name" class="input-label"></Label>
          <TextField
            col="0"
            ref="name"
            class="input"
            hint="Name"
            v-model="form.name"
            returnKeyType="next"
          ></TextField>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>
        <StackLayout class="input-field">
          <Label text="Description" class="input-label"></Label>
          <TextView
            col="0"
            ref="desc"
            class="input"
            hint="Description"
            :textWrap="true"
            v-model="form.description"
          ></TextView>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>
        <Button :isEnabled="formOk" text="Update" @tap="update()"></Button>
        <ActivityIndicator :busy="busy"/>
      </StackLayout>
    </GridLayout>
  </GridLayout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { SwipeDirection } from 'tns-core-modules/ui/gestures';
import Toast from '@/mixins/Toast';

export default {
  name: 'Schedule',
  mixins: [Toast],
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
      return (name.trim().length >= 3 && !this.tasks.some(t => name.trim() === t.name)) ||
        description.trim() !== this.task.description;
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
      console.info('onSwipe ' + direction);
      if (direction === SwipeDirection.left) {
        confirm(`Are you sure you want to delete "${this.task.name}"?`)
        .then((sure) => {
          if (sure) {
            this.doDelete();
          }
        });
      } else if (direction === SwipeDirection.right) {
        // Handle right swipe (mark)
      }
    },
    doDelete() {
      if (this.busy) return;
      this.busy = true;

      this.deleteTask(this.task)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showToast('Task deleted');
          } else {
            this.showToast('Task not deleted', true);
          }
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showToast(message, true);
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
            this.showToast('Done for today');
            return;
          }
          this.showToast('Could not complete task', true);
          this.resetScheduleForm();
        })
        .catch(({ message }) => this.showToast(message, true));
    },
    update() {
      if (this.busy) return;
      this.busy = true;
      this.form.description = this.form.description.trim();
      this.form.name = this.form.name.trim();

      this.updateTask(this.form)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showToast('Task updated');
          } else {
            this.showToast('Task not updated', true);
          }
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showToast(message, true);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../app-variables";

.task-container {
  background-color: #ffffff;
  margin-top: 5;
  margin-bottom: 5;
  padding-right: 10;

  .title {
    font-size: 30;
  }

  .bell {
    padding-top: 5;
    padding-bottom: 5;
  }

  .input-label {
    margin-bottom: 15;
  }

  .input {
    font-size: 18;
    placeholder-color: #a8a8a8;
  }

  .form {
    margin-left: 10;
    margin-right: 10;
    flex-grow: 2;
    vertical-align: middle;
  }

  .fa {
    color: $accent;
  }
}
</style>

