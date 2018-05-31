<template lang="html">
  <div class="main">
    <div class="left-section">
      <div class="left-section-row1">
        <router-link tag="span" class="icd-title" :to="'/operations/'+operation.icd">
          {{operation.icd}}
        </router-link>
        <span class="date">
          {{date}}
        </span>
        <el-tag class="el-tag" :type="tagType" size="mini">{{opAss}}</el-tag>
      </div>
      <div class="icd-description">
        {{name}}
      </div>
    </div>
    <div class="right-section">
      <el-button @click="deleteButtonClicked" icon="el-icon-delete" size="mini"/>
    </div>
  </div>
</template>

<script>
import IcdLibrary from '../assets/IcdLibrary.js'
import moment from 'moment'
import axios from 'axios'
export default {
  props: {
    operation: {
      type: Object,
      required: true
    }
  },
  computed: {
    name: function() {
      return IcdLibrary.nameForIcd(this.operation.icd)
    },
    date: function() {
      return moment(this.operation.date).format('YYYY-MM-DD')
    },
    tagType: function() {
      if (this.operation.mainOperator) {
        return 'success'
      }
      return 'warning'
    },
    opAss: function() {
      if (this.operation.mainOperator) {
        return 'Op'
      }
      return 'Ass'
    }
  },
  methods: {
    deleteButtonClicked() {
      axios.delete('/api/v1/operations/'+this.operation._id)
      .then(() => {
        console.log('Deleted!');
        this.$store.commit('removeOperation', this.operation._id)
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }
}
</script>

<style scoped lang="css">
.main {
  display: flex;
  justify-content: space-between;
}
.left-section {
  display: flex;
  flex-direction: column;
}
.left-section-row1 {
  display: flex;
  align-items: baseline;
}
.el-tag {
  align-self: center;
}
.right-section {
  display: flex;
  align-items: center;
}
.icd-title {
  font-size: 20px;
  font-weight: 400;
  margin-right: 10px;
  margin-bottom: 3px;
  cursor: pointer;
}
.icd-title:hover {
  border-bottom: 1px solid;
  margin-bottom: 2px;
}
.date {
  margin-right: 10px;
  font-weight: 300;
  color: gray
}
.icd-description {
  color: rgb(38, 38, 38)
}
</style>
