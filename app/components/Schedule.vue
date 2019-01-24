<template>
  <GridLayout columns="*, auto" class="task-container" :opacity="task.done ? '0.8' : '1'">
    <!-- Wrap in containers for bigger tap targets -->
    <GridLayout
      columns="auto, *"
      col="0"
      orientation="horizontal"
      class="tap-target"
      @tap="markItem()"
    >
      <Label col="0" :text="task.name" :class="nameClasses"></Label>
    </GridLayout>
    <GridLayout col="1" class="delete-container" @tap="deleteTask()">
      <StackLayout>
        <Image src="res://delete"></Image>
      </StackLayout>
    </GridLayout>
  </GridLayout>
</template>
<script>
export default {
  name: 'Schedule',
  props: {
    task: {
      required: true,
      type: Object
    }
  },
  computed: {
    nameClasses() {
      return this.task.done ? 'line-through title' : 'title';
    }
  },
  methods: {
    deleteTask() {

    },
    markItem() {

    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 30;
}
.platform-android .item-container {
  margin-top: 1;
}
.item-container {
  background-color: white;
  .visible {
    animation-name: show;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  .tap-target {
    padding-top: 13;
    padding-bottom: 13;
    padding-left: 16;
    label {
      min-width: 200;
    }
  }
  .check-box {
    margin-right: 10;
    height: 20;
  }
  .delete-container {
    padding: 10 15;
    vertical-align: middle;
    image {
      height: 20;
    }
    StackLayout {
      padding: 5;
    }
  }
}
</style>

