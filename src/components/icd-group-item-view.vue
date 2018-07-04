<template lang="pug">
  router-link(:to="'/operations/' + icdGroup.icd" tag="div" class="main" active-class="selected" @click.native='icdClick')
    <div class="left-section">
      div.icd-title {{icdGroup.icd}}
      div.icd-description {{icdGroup.name}}
    </div>
    <div class="right-section">
      span.oplog-label.default {{icdGroup.count.op + icdGroup.count.ass}}
    </div>
</template>

<script>
export default {
  props: {
    icdGroup: {
      type: Object,
      rquired: true
    }
  },
  methods: {
    icdClick: function() {
      this.$store.commit('setLeftSectionVisibility', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
}
.main:not(.selected):hover {
  background-color: rgba(0, 0, 0, 0.02);
  background-clip: padding-box;
}
.left-section {
  display: flex;
  flex-direction: column;
}
.selected {
  background-color: rgba(0, 0, 0, 0.10);
  background-clip: padding-box;
  border-left: 4px solid $oplog-green;
  padding-left: 16px;
}
.icd-title {
  font-size: 1.1rem;
  font-weight: 400;
}
.icd-description {
  font-size: 1rem;
  font-weight: 400;
  color: rgb(38, 38, 38)
}
</style>
