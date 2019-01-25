<template>
  <ListView v-if="tasks.length" for="task in tasks">
    <v-template>
      <Schedule :task="task"/>
    </v-template>
  </ListView>
  <Label v-else text="No tasks"/>
</template>
<script>
import { mapGetters } from 'vuex';
import Schedule from './Schedule';

export default {
  name: 'Schedules',
  components: {
    Schedule
  },
  computed: {
    ...mapGetters(['tasks'])
  }
}
</script>
