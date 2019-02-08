<template>
  <Page class="page" :actionBarHidden="true">
    <FlexboxLayout>
      <StackLayout class="details">
        <StackLayout>
          <Label class="title" :text="task.name"/>
        </StackLayout>
        <GridLayout columns="*, *" rows="*, *">
          <Label col="0" row="0" class="label" text="Current streak"/>
          <Label col="1" row="0" class="streak" :text="currentStreak"/>
          <Label col="0" row="1" class="label" text="Longest streak"/>
          <Label col="1" row="1" class="streak" :text="longestStreak"/>
        </GridLayout>
      </StackLayout>
      <StackLayout>
        <RadCalendar
          ref="calendar"
          locale="en-US"
          :selectionMode="selectionMode"
          :viewMode="viewMode"
          :eventSource="events"
        />
      </StackLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
import { Color } from 'tns-core-modules/color';
import { CalendarSelectionMode, CalendarViewMode, CalendarEvent } from 'nativescript-ui-calendar';

export default {
  name: 'TaskReport',
  props: ['id'],
  data() {
    return {
      selectionMode: CalendarSelectionMode.None,
      viewMode: CalendarViewMode.Month,
    };
  },
  computed: {
    ...mapGetters(['tasks']),
    task() {
      return this.tasks.find(({ id }) => id === this.id);
    },
    currentStreak() {
      const result = [];
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      for (let d = this.streakable.length - 1; d >= 0; --d) {
        const date = new Date(this.streakable[d].due_date);
        date.setUTCHours(0, 0, 0, 0);
        if (this.streakable[d].done) {
          result.push(this.streakable[d]);
        } else if (+today !== +date) {
          break;
        }
      }

      return result.length;
    },
    longestStreak() {
      const streaks = [];
      for (let d = 0; d < this.streakable.length; ++d) {
        const x = [];
        while (this.streakable[d] && this.streakable[d].done) {
          x.push(this.streakable[d]);
          ++d;
        }
        streaks.push(x);
      }

      return !streaks.length ? 0 : Math.max(...streaks.map(streak => streak.length));
    },
    streakable() {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      return this.task.schedules
        .filter(({ due_date, done }) => {
          const date = new Date(due_date);
          date.setUTCHours(0, 0, 0, 0);

          const isToday = +today === +date && !done;

          return isToday || today >= date;
        });
    },
    events() {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      return this.task.schedules
        .map((schedule) => {
          const startDate = new Date(schedule.due_date);
          startDate.setUTCHours(0, 0, 0, 0);

          const endDate = new Date(startDate);
          endDate.setUTCHours(18, 0, 0, 0);

          const isToday = +today === +startDate && !schedule.done;

          let backgroundColor;
          if (schedule.done) { // done
            backgroundColor = '#66CC7F';
          } else if (isToday) { // today
            backgroundColor = '#8B8C8B';
          } else if (today <= startDate) { // upcoming
            backgroundColor = '#D3D3D3';
          } else { // missed
            backgroundColor = '#FF8080';
          }

          return new CalendarEvent(
            this.task.name,
            startDate,
            endDate,
            true,
            new Color(backgroundColor)
          );
        });
    }
  }
}
</script>
<style scoped lang="scss">
FlexboxLayout {
  align-items: center;
  flex-direction: column;
  margin-top: 20;
  margin-left: 10;
  margin-right: 10;
}

.details {
  height: 400;

  .title {
    font-size: 40;
    margin-bottom: 20;
  }

  .label {
    font-size: 25;
    vertical-align: middle;
  }

  .streak {
    vertical-align: middle;
    font-size: 50;
    font-weight: bold;
    text-align: left;
  }
}
</style>
