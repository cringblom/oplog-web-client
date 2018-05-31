<template lang="html">
  <el-container v-if="$store.state.loadingOperations" class="el-container loading-operations">
    Laddar operationer...
  </el-container>
  <el-container v-else-if="operations.length > 0" class="el-container">
    <el-aside width="300px" class="el-aside">
      <div class="left-section">
        <icd-groups-view/>
      </div>
    </el-aside>
    <el-main class="el-main">
      <div class="right-section">
        <span class="icd-title">{{title}}</span>
        <el-tooltip content="Ass" placement="top">
          <span class="icd-title-count ass">{{count.ass}}</span>
        </el-tooltip>
        <el-tooltip content="Op" placement="top">
          <span class="icd-title-count op">{{count.op}}</span>
        </el-tooltip>
        <el-tooltip content="Total" placement="top">
          <span class="icd-title-count">{{count.ass + count.op}}</span>
        </el-tooltip>
      </div>
      <div class="operations-list">
        <operationItemView class="operation-item-view" v-for="operation in operations" :operation="operation" :key="operation._id"/>
      </div>
    </el-main>
  </el-container>
  <el-container v-else class="el-container no-operations">
    <div class="sad-face">
      :(
    </div>
    <div>
      Inga operationer
    </div>
  </el-container>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import operationItemView from './operation-item-view.vue'
import icdGroupsView from './icd-groups-view.vue'
export default {
  name: 'operations-view',
  computed: {
    operations: function() {
      if (this.icd) {
        return _.filter(this.$store.state.operations, (operation) => {
          return this.icd.toLowerCase() == operation.icd.toLowerCase()
        })
      }
      return this.$store.state.operations
    },
    icd: function() {
      return this.$route.params.icd
    },
    title: function() {
      return this.icd || 'Alla operationer'
    },
    count: function() {
      if (this.icd) {
        var icd = this.icd.toLowerCase()
        var selectedIcdGroup = _.find(this.$store.getters.icdGroups, function(icdGroup) {
          return icdGroup.icd.toLowerCase() === icd
        })
        if (selectedIcdGroup) {
          return selectedIcdGroup.count
        }
        return {op: 0, ass: 0}

      }
      return this.$store.getters.operationsCount
    }
  },
  components: {
    operationItemView,
    icdGroupsView
  },
  created: function() {
    this.$store.dispatch('fetchOperations')
  }
}
</script>

<style scoped>
.el-container {
  margin-top: 60px;
}
.el-container.no-operations, .el-container.loading-operations {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(3, 3, 3, 0.4);
  font-size: 1.5rem
}
.el-main {
  padding-top: 0;
}
.el-aside {
  border-right: 1px solid rgba(0, 0, 0, 0.25);
}
.right-section {
  padding-top: 20px;
}

.icd-title {
  font-size: 2.1rem;
  font-weight: 400;
  margin-right: 10px;
}
.icd-title-count {
  font-size: 1.6rem;
  font-weight: 300;
  margin-right: 5px;
}
.icd-title-count.ass {
  color: #e6a23c;
}
.icd-title-count.op {
  color: rgb(102, 164, 72);
}
.operations-list {
  border: 1px solid;
  border-radius: 5px;
  border-color: rgba(0,0,0,.125);
  margin-top: 20px;
}
.operation-item-view {
  padding: 12px;
  border-bottom: 1px solid;
  border-color: rgba(0,0,0,.125);
}
.operation-item-view:last-child {
  padding: 10px;
  border-bottom: none;
}
.sad-face {
  font-size: 1.8rem;
}
</style>
