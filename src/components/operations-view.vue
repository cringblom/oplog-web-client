<template lang="pug">
  div.operations-view-container.loading-operations(v-if="$store.state.loadingOperations") Laddar operationer...
  div.operations-view-container(v-else-if="operations.length > 0")
    div.operations-view-left-section(:class='{"show-left-section": $store.state.showLeftSection}')
      icd-groups-view
    div.operations-view-right-section(:class='{"show-left-section": $store.state.showLeftSection}')
      div.operations-view-right-section-title
        span.icd-title {{title}}
        div
          span.icd-title-count.ass(v-tooltip="'Ass'") {{count.ass}}
          span.icd-title-count.op(v-tooltip="'Op'") {{count.op}}
          span.icd-title-count(v-tooltip="'Total'") {{count.ass + count.op}}
        span.icd-title-days-since-last-op {{daysSinceOp}}
      div.operations-list
        operation-item-view.operation-item-view(v-for="operation in operations" :operation="operation" :key="operation._id")
  div.operations-view-container.no-operations(v-else)
    div.sad-face :(
    div Inga operationer
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
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
    },
    daysSinceOp: function() {
      const mostRecentOpDate = moment.utc(this.operations[0].date).startOf('day')
      const nowDate = moment.utc().startOf('day')
      const difference = nowDate.diff(mostRecentOpDate, 'days')
      if (difference === 0) {
        return 'Senast opererat idag'
      }
      if (difference === 1) {
        return 'Senast opererat igår'
      } else {
        return 'Senast opererat för '+difference+' dagar sedan'
      }
    }
  },
  components: {
    operationItemView,
    icdGroupsView
  },
  created() {
    this.$store.dispatch('fetchOperations')
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.operations-view-container {
  display: flex;
  flex-grow: 1;
  margin-top: 64px;
  overflow-y: hidden;
}
.operations-view-container.no-operations, .operations-view-container.loading-operations {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(3, 3, 3, 0.4);
  font-size: 1.5rem
}
.operations-view-left-section {
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  flex-basis: 300px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  @media screen and (max-width: $oplog-width-breakpoint) {
    flex: 0;
    border: none;
    &.show-left-section {
      flex: 1;
    }
  }
}
.operations-view-right-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  &.show-left-section {
    @media screen and (max-width: $oplog-width-breakpoint) {
      flex: 0;
    }
  }
  > * {
    margin-left: 20px;
    margin-right: 20px;
  }
}
.operations-view-right-section-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  flex-shrink: 0;
  margin-bottom: 20px;
  margin-top: 20px;
  @media screen and (max-width: $oplog-width-breakpoint) {
    flex-direction: column;
  }
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
.icd-title-days-since-last-op {
  color: rgb(84, 84, 84);
  margin-left: auto;
}
.operations-list {
  border: 1px solid;
  border-radius: 5px;
  border-color: rgba(0,0,0,.125);
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
