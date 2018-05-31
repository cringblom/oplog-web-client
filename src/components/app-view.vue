<template lang="html">
  <el-container style="height: 100%">
    <el-header class="el-header">
      <app-header-view/>
    </el-header>
      <router-view></router-view>
    <add-operation-modal-view/>
  </el-container>
</template>

<script>
import appHeaderView from './app-header-view.vue'
import addOperationModalView from './add-operation-modal-view.vue'
export default {
  components: {
    appHeaderView,
    addOperationModalView
  },
}
</script>

<style scoped lang="css">
  .el-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    justify-content: space-between;
    background-color: white;
    border-top: 3px solid rgb(102, 164, 72);
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  }
</style>
