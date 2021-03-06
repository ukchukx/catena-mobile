<template>
  <StackLayout orientation="vertical">
    <GridLayout
      columns="auto, *, auto"
      rows="*, auto"
      class="task-container"
      @longPress="onLongPress()"
    >
      <Label v-if="canMark" col="0" row="0" :text="'\uf0a2'" class="fa bell"></Label>
      <Label @tap="toggleForm()" col="1" row="0" :text="task.name" :class="titleClasses"></Label>
      <Label col="2" row="0" :text="'\uf054'" class="fa arrow" @tap="arrowTap()"></Label>
      <GridLayout row="1" colSpan="3">
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

    <StackLayout opacity="0.2" backgroundColor="#bab8b8" height="1" />
  </StackLayout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
// import { SwipeDirection } from 'tns-core-modules/ui/gestures';
import Toast from '@/mixins/Toast';
import TaskReport from './TaskReport';

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
      busy: false
    };
  },
  computed: {
    ...mapGetters(['tasks']),
    formOk() {
      const { form: { name, description } } = this;
      return name.trim().length >= 3 || description.trim() !== this.task.description;
    },
    titleClasses() {
      return this.canMark ? 'title' : 'title not-due';
    },
    canMark() {
      return !!this.todaySchedule && !this.todaySchedule.done;
    },
    longPressOptions() {
      const common = ['Delete'];
      return this.canMark ? ['Mark', ...common] : common;
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
  created() {
    if (this.todaySchedule) this.scheduleForm.id = this.todaySchedule.id;
  },
  methods: {
    ...mapActions(['deleteTask', 'updateTask', 'markTaskAsDone', 'updateSchedule']),
    toggleForm() {
      this.showForm = !this.showForm;
    },
    resetScheduleForm() {
      this.scheduleForm.remarks = '';
    },
    onLongPress() {
      action('What would you like to do?', 'Cancel', this.longPressOptions)
      .then((choice) => {
        switch(choice) {
          case 'Delete':
            confirm(`Should I delete "${this.task.name}"?`)
              .then(sure => sure ? this.doDelete() : sure);
            break;
          case 'Mark':
            this.mark();
        }
      });
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
      if (this.busy) return;
      this.busy = true;
      this.markTaskAsDone(this.task)
        .then((success) => {
          this.busy = false;
          if (success) {
            if (this.scheduleForm.remarks.length) this.updateSchedule(this.scheduleForm);
            this.showToast('Done for today', true);
          } else {
            this.showToast('Could not complete task', true);
          }
          this.resetScheduleForm();
        })
        .catch(({ message }) => {
          this.busy = false;
          this.resetScheduleForm();
          this.showToast(message, true);
        });
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
    },
    arrowTap() {
      this.$navigateTo(TaskReport, { props: { id: this.task.id } });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../app-variables";

.task-container {
  background-color: #ffffff;
  padding-right: 10;
  padding-left: 10;

  Label.title {
    padding-top: 15;
    padding-bottom: 15;
  }

  .arrow, .bell {
    vertical-align: middle;
    color: #aaa9a9;
  }

  .title {
    font-size: 25;

    &.not-due {
      color: #9c9898;
    }
  }

  .bell {
    font-size: 10;
    padding-right: 10;
    color: $disabled;
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
}
</style>

