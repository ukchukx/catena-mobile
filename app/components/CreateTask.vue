<template>
  <Page class="page" :actionBarHidden="true">
    <FlexboxLayout>
      <ScrollView scrollBarIndicatorVisible="false">
        <StackLayout class="form">
          <StackLayout class="input-field">
            <Label text="Name" class="input-label"/>
            <TextField class="input" v-model="form.name" returnKeyType="next"/>
            <StackLayout class="hr-light"/>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Description" class="input-label"/>
            <TextView
              class="input"
              :textWrap="true"
              v-model="form.description"
              returnKeyType="done"
            />
            <StackLayout class="hr-light"/>
          </StackLayout>

          <StackLayout class="input-field">
            <check-box
              fillColor="#42B882"
              boxType="circle"
              v-for="op in typeOptions"
              :key="op.value"
              :ref="op.value"
              :text="op.text"
              @checkedChange="onTypeCheckedChange($event.value, op.value)"
            />
          </StackLayout>

          <StackLayout v-show="isDaily" class="input-field">
            <check-box
              fillColor="#42B882"
              v-for="op in dayOptions"
              :key="op.value"
              :ref="op.value"
              :text="op.text"
              @checkedChange="onDayCheckedChange($event.value, op)"
            />
          </StackLayout>
          <StackLayout v-show="isMonthly" class="input-field">
            <Label text="Choose day (1-28)" class="input-label"/>
            <TextField
              class="input"
              :autocorrect="false"
              autocapitalizationType="none"
              keyboardType="number"
              v-model.number="selectedDate"
              returnKeyType="done"
            />
            <StackLayout class="hr-light"/>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Start date" class="input-label"/>
            <DatePicker :minDate="new Date()" :maxDate="dateRange.end" v-model="dateRange.start" />
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="End date" class="input-label"/>
            <DatePicker :minDate="dateRange.start" :maxDate="endOfYear" v-model="dateRange.end" />
          </StackLayout>

          <Button :class="buttonClasses" :isEnabled="formOk" text="Create" @tap="onSubmit()"></Button>
          <ActivityIndicator :busy="busy"/>
        </StackLayout>
      </ScrollView>
    </FlexboxLayout>
  </Page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Toast from '@/mixins/Toast';
import dateGenerator from '@/utils/dateGenerator';

export default {
  name: 'CreateTask',
  mixins: [Toast],
  data() {
    const endDate = new Date();
    endDate.setMonth(11);
    endDate.setDate(31);
    const endOfYear = new Date(endDate);

    return {
      busy: false,
      form: {
        name: '',
        description: '',
        schedules: []
      },
      endOfYear,
      endDate,
      dateRange: {
        start: new Date(),
        end: endDate
      },
      selectedType: 'daily',
      selectedDate: 1,
      typeOptions: [
        { text: 'Daily', value: 'daily' },
        { text: 'Monthly', value: 'monthly' }
      ],
      selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      dayOptions: [
        { text: 'Monday', value: 'Mon' },
        { text: 'Tuesday', value: 'Tue' },
        { text: 'Wednesday', value: 'Wed' },
        { text: 'Thursday', value: 'Thu' },
        { text: 'Friday', value: 'Fri' },
        { text: 'Saturday', value: 'Sat' },
        { text: 'Sunday', value: 'Sun' }
      ]
    };
  },
  computed: {
    ...mapGetters(['user', 'tasks']),
    isDaily() {
      return this.selectedType === 'daily';
    },
    isMonthly() {
      return this.selectedType === 'monthly';
    },
    formOk() {
      const { isDaily, form: { name }, selectedDays, selectedDate, dateRange: { end } } = this;
      const basicCondition = name.length >= 3 && end !== null;

      return isDaily ? (!!selectedDays.length && basicCondition) :
        basicCondition && (selectedDate >= 1 && selectedDate <= 28);
    },
    buttonClasses() {
      return this.formOk ? 'btn-primary' : '';
    }
  },
  watch: {
    selectedDate(num) {
      if (num < 1) this.selectedDate = 1;
      if (num > 28) this.selectedDate = 28;
    }
  },
  mounted() {
    // Select all days at the beginning and select daily as the type
    this.selectedDays.forEach(d => this.$refs[d][0].nativeView.checked = true);
    this.$refs[this.selectedType][0].nativeView.checked = true;
  },
  methods: {
    ...mapActions(['createTask']),
    onDayCheckedChange(value, day) {
      if (value) {
        if (this.selectedDays.indexOf(day.value) === -1) this.selectedDays.push(day.value);
      } else {
        this.selectedDays = this.selectedDays.filter(d => d !== day.value);
      }
    },
    onTypeCheckedChange(value, type) {
      if (type === this.selectedType && value) return;

      if (value) {
        if (type === 'daily') {
          this.$refs.monthly[0].nativeView.checked = false;
        } else {
          this.$refs.daily[0].nativeView.checked = false;
        }
        this.selectedType = type;
      }
    },
    onSubmit() {
      if (this.busy) return;
      this.busy = true;

      const selectedDays = this.isDaily ? [...this.selectedDays] : [];
      let schedules = [...dateGenerator(Object.assign({ selectedDays }, this.dateRange))];

      if (this.isMonthly) { // Filter out the unneeded dates
        schedules = schedules.filter(date => date.getDate() === this.selectedDate);
      }

      this.form.schedules = schedules.map(date => ({ due_date: date.toISOString() }));

      if (!this.form.schedules.length) {
        this.busy = false;
        this.showToast('No schedules can be created from your selection', true);
        return;
      }

      this.form.name = this.form.name.trim();
      this.form.description = this.form.description.trim();

      this.createTask(this.form)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showToast('Task created');
            this.$navigateBack();
            return;
          }
          this.showToast('Could not create task', true);
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showToast(message, true);
        });
    }
  }
};
</script>
<style scoped lang="scss">
@import "../app-variables";

FlexboxLayout {
  align-items: center;
  flex-direction: column;
}

.form {
  margin-left: 10;
  margin-right: 10;
  flex-grow: 2;
  vertical-align: middle;
}

.input-label {
  margin-bottom: 15;
}

.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}

.btn-primary {
  background-color: $accent;
  color: #ffffff;
}
</style>
