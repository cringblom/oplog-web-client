<template lang="html">
  <el-dialog :visible="isVisible" title="Lägg till operation" @close="close" @open="open">
    <el-row>
      <el-col :span="24">
        <el-form label-width="120px">
          <el-form-item label="Operation">
            <el-autocomplete
              ref="icdInput"
              v-model="operationInput"
              :fetch-suggestions="searchIcd"
              @select="icdInputSelected"
              style="width: 100%"
              placeholder="Sök operation efter namn eller ICD-kod"/>
          </el-form-item>
          <el-form-item label="Datum">
            <el-date-picker v-model="date" placeholder="Datum"/>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="opAss" label="op" border>Operatör</el-radio>
            <el-radio v-model="opAss" label="ass" border>Assistent</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="close">
        Avbryt
      </el-button>
      <el-button @click="saveButtonClicked" type="primary">
        Lägg till {{icd}}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import IcdLibrary from '../assets/IcdLibrary.js'
import moment from 'moment'
import axios from 'axios'
export default {
  data() {
    return {
      operationInput: '',
      icd: '',
      opAss: "op",
      date: new Date(),
    }
  },
  computed: {
    isVisible: function() {
      return this.$store.state.addOperationModalIsVisible
    }
  },
  methods: {
    searchIcd: function(searchString, callback) {
      var filteredIcdCodes = IcdLibrary.filterIcdCodes(searchString)
      callback(filteredIcdCodes)
    },
    icdInputSelected: function(input) {
      this.icd = input.icd
    },
    saveButtonClicked: function() {
      var newOperation = {
        icd: this.icd,
        date: moment(this.date).format('YYYY-MM-DD'),
        mainOperator: this.opAss == 'op'
      }
      axios.post("/api/v1/operations", newOperation)
      .then((res) => {
        this.$store.commit('addOperation', res.data)
        this.$store.commit('hideAddOperationModal')
      })
      .catch(function(err) {
        console.log(err)
        console.log(err.response);
      })
    },
    close: function() {
      this.$store.commit('hideAddOperationModal')
    },
    open: function() {
      this.operationInput = ''
      this.icd = ''
      this.opAss = 'op'
      this.date = new Date()
    },
    test: function() {
      this.$refs.icdInput.focus()
    }
  }
}
</script>

<style lang="css">
</style>
