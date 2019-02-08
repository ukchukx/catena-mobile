<template>
  <RadListView
    pullToRefresh="true"
    swipeActions="true"
    v-if="sortedTasks.length"
    ref="taskList"
    for="task in sortedTasks"
    @pullToRefreshInitiated="onPullToRefreshInitiated"
  >
    <v-template>
      <Schedule :task="task"/>
    </v-template>
    <v-template name="itemswipe">
      <GridLayout columns="auto, *, auto" backgroundColor="White">
        <StackLayout
          id="mark-view"
          col="0"
          class="swipe-item left"
          orientation="horizontal"
          @tap="onLeftSwipeClick"
        >
          <Label text="mark" verticalAlignment="center" horizontalAlignment="center"/>
        </StackLayout>
        <StackLayout
          id="delete-view"
          col="2"
          class="swipe-item right"
          orientation="horizontal"
          @tap="onRightSwipeClick"
        >
          <Label text="delete" verticalAlignment="center" horizontalAlignment="center"/>
        </StackLayout>
      </GridLayout>
    </v-template>
  </RadListView>
  <Label v-else text="No tasks"/>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Schedule from './Schedule';

export default {
  name: 'Schedules',
  components: {
    Schedule
  },
  computed: {
    ...mapGetters(['tasks']),
    dueTasks() {
      const today = new Date();
      today.setUTCHours(12, 0, 0, 0);
      return this.tasks.filter(({ schedules }) => schedules
        .some(({ due_date }) => {
          const dueDate = new Date(due_date);
          return today.getFullYear() === dueDate.getFullYear() &&
            today.getMonth() === dueDate.getMonth() &&
            today.getDate() === dueDate.getDate();
        })
      );
    },
    notDueTasks() {
      return this.tasks.filter(({ id }) => this.dueTasks.every(task => task.id !== id));
    },
    sortedTasks() {
      return [...this.dueTasks, ...this.notDueTasks];
    }
  },
  methods: {
    ...mapActions(['fetchProfile']),
    onPullToRefreshInitiated ({ object }) {
      this.fetchProfile()
        .then(() => {
          object.notifyPullToRefreshFinished();
        })
        .catch(() => {
          object.notifyPullToRefreshFinished();
          this.showToast('Could not fetch tasks');
        });
    },
    onSwipeStarted ({ data, object }) {
      console.log(`Swipe started`);
      const swipeLimits = data.swipeLimits;
      const swipeView = object;
      const leftItem = swipeView.getViewById('mark-view');
      const rightItem = swipeView.getViewById('delete-view');
      swipeLimits.left = leftItem.getMeasuredWidth();
      swipeLimits.right = rightItem.getMeasuredWidth();
      swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
    },
    onLeftSwipeClick (event) {
      console.log('left action tapped');
      console.dir(event);
      this.$refs.taskList.notifySwipeToExecuteFinished();
    },
    onRightSwipeClick ({ object }) {
      console.log('right action tapped');
      console.dir(object);
      // remove item
      // this.itemList.splice(this.itemList.indexOf(object.bindingContext), 1);
      this.$refs.taskList.notifySwipeToExecuteFinished();
    }
  }
}
</script>
