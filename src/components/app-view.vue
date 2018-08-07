<template lang="pug">
  div.container
    notifications(position='top center' group='app-notifications' classes='oplog-notification' width='300px')
    div.header-container
      app-header-view
    router-view
    add-operation-modal-view(v-if='$store.state.addOperationModalIsVisible')
    remove-account-modal-view(v-if='$store.state.removeAccountModalIsVisible')
</template>

<script>
import appHeaderView from './app-header-view.vue'
import addOperationModalView from './add-operation-modal-view-v2.vue'
import removeAccountModalView from './remove-account-modal-view.vue'
export default {
  components: {
    appHeaderView,
    addOperationModalView,
    removeAccountModalView
  },
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.container {
  height: 100%;
  display: flex;
}
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: space-between;
  background-color: white;
  border-top: 3px solid $oplog-green;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
</style>
<style lang="scss">
</style>
