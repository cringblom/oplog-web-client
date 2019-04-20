<template lang="pug">
  div
    router-link.all-operations-link(
      :to="'/operations'"
      tag="div"
      :class="{'all-operations-selected': $route.path==='/operations'}"
      @click.native='$store.commit("setLeftSectionVisibility", false)') Alla operationer
    icd-group-item-view.icd-group-item-view(
      v-for="icdGroup in icdGroups"
      :icdGroup="icdGroup"
      :key="icdGroup.icd")
</template>

<script>
import icdGroupItemView from './icd-group-item-view.vue'
export default {
  components: {
    icdGroupItemView
  },
  computed: {
    icdGroups: function() {
      return this.$store.getters.icdGroups
    }
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.all-operations-link {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  cursor: pointer;
  font-size: 1.3rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    background-clip: padding-box;
  }
  &.all-operations-selected {
    background-color: rgba(0, 0, 0, 0.10);
    background-clip: padding-box;
    border-left: 4px solid $oplog-green;
    padding-left: 16px;
  }
}
.icd-group-item-view {
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
</style>
