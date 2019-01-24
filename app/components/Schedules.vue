<template>
  <ListView v-if="tasks.length" for="task in tasks" @itemTap="onItemTap">
    <v-template>
      <Schedule :task="task"/>
    </v-template>
  </ListView>
  <Label v-else text="No tasks"/>
</template>
<script>
import Schedule from './Schedule';

export default {
  name: 'Schedules',
  components: {
    Schedule
  },
  computed: {
    tasks() {
      return [{ name: 'One', done: true },
      { name: 'Two', done: false }, { name: 'Three', done: true },
      { name: 'Four', done: false}];
    }
  },
  methods: {
    onItemTap({ item }) {
      console.info(item);
    }
  }
}
</script>
