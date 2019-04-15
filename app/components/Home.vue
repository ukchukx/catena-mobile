<template>
  <Page :actionBarHidden="true">
    <TabView
      height="100%"
      androidTabsPosition="bottom"
      iosIconRenderingMode="alwaysOriginal"
    >
      <TabViewItem style="font-family: FontAwesome;" :title="schedulesTabTitle">
        <StackLayout orientation="vertical" width="100%" height="100%">
          <Schedules/>
        </StackLayout>
      </TabViewItem>

      <TabViewItem style="font-family: FontAwesome;" :title="addScheduleTabTitle">
        <StackLayout orientation="vertical" width="100%" height="100%">
          <CreateTask />
        </StackLayout>
      </TabViewItem>

      <TabViewItem style="font-family: FontAwesome;" :title="profileTabTitle">
        <StackLayout orientation="vertical" width="100%" height="100%">
          <Profile/>
          <Button :text="logoutButtonText" @tap="logout()"/>
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
    Profile,
    CreateTask
  },
  computed: {
    logoutButtonText() {
      return '\uf090 Logout';
    },
    profileTabTitle() {
      return '\uf2c0';
    },
    schedulesTabTitle() {
      return '\uf03a';
    },
    addScheduleTabTitle() {
      return '\uf067';
    }
  },
  methods: {
    ...mapActions(['deleteUser']),
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
