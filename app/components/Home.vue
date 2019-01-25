<template>
  <Page class="page" :actionBarHidden="true">
    <TabView
      @selectedIndexChanged="onSelectedIndexChanged"
      height="100%"
      androidTabsPosition="bottom"
      iosIconRenderingMode="alwaysOriginal"
    >
      <TabViewItem title="Schedules">
        <StackLayout orientation="vertical" width="100%" height="100%">
          <Button text="Add task" @tap="onAddItemTap"/>
          <PullToRefresh @refresh="refreshTasks">
            <Schedules/>
          </PullToRefresh>
        </StackLayout>
      </TabViewItem>

      <TabViewItem title="Profile">
        <Label text="This tab show the profile view" textWrap="true"/>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';
import Schedules from './Schedules';
import Login from './Login';
import Toast from '@/mixins/Toast';

export default {
  name: 'Home',
  mixins: [Toast],
  components: {
    Schedules
  },
  methods: {
    ...mapActions(['fetchTasks']),
    onAddItemTap(e) {
      this.$navigateTo(Login);
    },
    onSelectedIndexChanged({ newIndex }) {
      if (newIndex === 0) {
        this.showToast('Swipe down to refresh');
        this.showToast('Swipe right to mark done and left to delete', true);
      }
    },
    refreshTasks({ object }) {
      this.fetchTasks()
      .then((success) => {
        object.refreshing = false;
      })
      .catch(() => {
        object.refreshing = false;
      });
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
</style>
