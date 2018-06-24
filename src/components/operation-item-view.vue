<template lang="pug">
  div.main
    div.left-section
      div.left-section-row1
        span.icd-title(@click="$router.push('/operations/'+operation.icd)") {{operation.icd}}
        span.date {{date}}
        span.oplog-label(:class='labelClass') {{opAss}}
      div.icd-description {{name}}
    div.right-section
      button.oplog-button.oplog-button-default(@click="deleteButtonClicked" tabindex='-1')
        font-awesome-icon(:icon='trashIcon')
</template>

<script>
import IcdLibrary from '../assets/IcdLibrary.js'
import moment from 'moment'
import axios from 'axios'
import fontAwesomeIcon from '@fortawesome/vue-fontawesome'
import trashIcon from '@fortawesome/fontawesome-free-solid/faTrashAlt'
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
    labelClass: function() {
      if (this.operation.mainOperator) {
        return 'op'
      }
      return 'ass'
    },
    opAss: function() {
      if (this.operation.mainOperator) {
        return 'Op'
      }
      return 'Ass'
    },
    trashIcon: function() {
      return trashIcon
    },
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
  },
  components: {
    fontAwesomeIcon
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
.oplog-label {
  align-self: center
}
.icd-description {
  color: rgb(38, 38, 38)
}
</style>
