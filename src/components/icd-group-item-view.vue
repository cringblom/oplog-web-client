<template lang="html">
  <router-link :to="'/operations/' + icdGroup.icd" tag="div" class="main" active-class="selected">
    <div class="left-section">
      <div class="icd-title">
        {{icdGroup.icd}}
      </div>
      <div class="icd-description">
        {{icdGroup.name}}
      </div>
    </div>
    <div class="right-section">
      <el-tag type="info" size="mini">
        {{icdGroup.count.op + icdGroup.count.ass}}
      </el-tag>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    icdGroup: {
      type: Object,
      rquired: true
    }
  }
}
</script>

<style scoped lang="css">
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
  border-left: 4px solid rgb(102, 164, 72);
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
