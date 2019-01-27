<template>
  <Page :actionBarHidden="true">
    <TabView
      @selectedIndexChanged="onSelectedIndexChanged"
      height="100%"
      androidTabsPosition="bottom"
      iosIconRenderingMode="alwaysOriginal"
    >
      <TabViewItem style="font-family: FontAwesome;" :title="'\uf03a Schedules'">
        <StackLayout orientation="vertical" width="100%" height="100%">
          <Button class="btn-primary" text="Add task" @tap="onAddItemTap()"/>
          <Schedules/>
        </StackLayout>
      </TabViewItem>

      <TabViewItem style="font-family: FontAwesome;" :title="'\uf2c0 Profile'">
        <StackLayout orientation="vertical" width="100%" height="100%">
          <Button class="btn-primary" text="Logout" @tap="logout()"/>
          <Profile/>
        </StackLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';
import Toast from '@/mixins/Toast';
import Schedules from './Schedules';
import Profile from './Profile';
import Login from './Login';
import CreateTask from './CreateTask';

export default {
  name: 'Home',
  mixins: [Toast],
  components: {
    Schedules,
    Profile
  },
  methods: {
    ...mapActions(['deleteUser']),
    onAddItemTap() {
      this.$navigateTo(CreateTask);
    },
    onSelectedIndexChanged({ newIndex }) {
      if (newIndex === 0) {
        this.showToast('Pull down to refresh');
        this.showToast('Long press a task to mark or delete', true);
      }
    },
    logout() {
      this.deleteUser();
      this.$navigateTo(Login);
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
.fa {
  color: $accent-dark;
}

.info {
  font-size: 20;
}

.btn-primary {
  background-color: $accent;
  color: #ffffff;
}
</style>
