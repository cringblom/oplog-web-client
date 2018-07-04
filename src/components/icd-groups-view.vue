<template lang="html">
  <div>
    <router-link :to="'/operations'" tag="div" class="all-operations-link" @click.native='$store.commit("setLeftSectionVisibility", false)'>
      Alla operationer
    </router-link>
    <icd-group-item-view class="icd-group-item-view" v-for="icdGroup in icdGroups" :icdGroup="icdGroup" :key="icdGroup.icd"/>
  </div>
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

<style scoped lang="css">
.all-operations-link {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  cursor: pointer;
  font-size: 1.3rem;
}
.all-operations-link:hover {
  background-color: rgba(0, 0, 0, 0.02);
  background-clip: padding-box;
}
.icd-group-item-view {
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
</style>
