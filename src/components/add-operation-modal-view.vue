<template lang="pug">
  transition(name='modal')
    div.modal-mask(@mousedown.self='close')
      div.modal-container.modal-container-green
        div.modal-header Lägg till operation
        form.add-operation-modal-form(@submit.prevent='submit')
          input.add-operation-modal-input-operation(v-model='icdInput' ref='icdInput' placeholder='Sök operation' @focus='operationInputIsFocused = true' @blur='operationInputIsFocused = false')
          div.icd-selector(:class='{show: operationInputIsFocused}')
            div.icd-selector-content(v-if='icdInput.length < 2') Sök operation ovan
            div.icd-selector-content(v-else-if='filteredIcdCodes.length == 0') Hittade tyvärr inget :/
            div.icd-selector-item(v-else v-for='icdCode in filteredIcdCodes' @mousedown='selectedIcd = icdCode') {{icdCode.icd}} {{icdCode.name}}
          datepicker(v-model='date' monday-first=true input-class='oplog-input' style='margin-bottom: 10px')
          label.opass-radio Operatör
            input(type='radio' name='opass' value='op' v-model='opAss')
            div.radio-indicator
          label.opass-radio Assistent
            input(type='radio' name='opass' value='ass' v-model='opAss')
            div.radio-indicator
          div.add-operation-modal-buttons
            button.oplog-button.oplog-button-default.close-button(type='button' @click='close') Avbryt
            button.oplog-button.oplog-button-default.submit-button(:disabled='disabledSubmitButton') Lägg till
              span(style='font-weight: 500')  {{icdCode}}
</template>

<script>
import IcdLibrary from '../assets/IcdLibrary.js'
import datepicker from 'vuejs-datepicker';
import moment from 'moment'
import axios from 'axios'
//import _ from 'lodash'
export default {
  data() {
    return {
      icdInput: '',
      operationInputIsFocused: false,
      selectedIcd: undefined,
      date: new Date,
      opAss: 'op',
      isLoading: false
    }
  },
  methods: {
    close: function() {
      this.$store.commit('hideAddOperationModal')
    },
    submit: function() {
      this.isLoading = true
      var newOperation = {
        icd: this.selectedIcd.icd,
        date: moment(this.date).format('YYYY-MM-DD'),
        mainOperator: this.opAss == 'op'
      }
      axios.post("/api/v1/operations", newOperation)
      .then((res) => {
        this.$store.commit('addOperation', res.data)
        this.$store.commit('hideAddOperationModal')
      })
      .catch(function(err) {
        this.isLoading = false
        console.log(err)
        console.log(err.response);
      })
    }
  },
  computed: {
    filteredIcdCodes: function() {
      if (this.icdInput.length < 2) {
        var topIcdCodes = this.$store.getters.icdGroups
        if (topIcdCodes.length > 0) {
          return topIcdCodes
        }
        return []
      }
      return IcdLibrary.filterIcdCodes(this.icdInput)
    },
    icdCode: function() {
      if (this.selectedIcd) {
        return this.selectedIcd.icd
      }
      return ''
    },
    disabledSubmitButton: function() {
      if (this.isLoading) {
        return true
      }
      if (this.selectedIcd) {
        return false
      } else {
        return true
      }
    }
  },
  mounted: function() {
    this.$refs.icdInput.focus()
  },
  watch: {
    selectedIcd: function(newIcd, oldIcd) {
      if (newIcd != oldIcd) {
        this.icdInput = newIcd.icd + ' ' + newIcd.name
      }
    }
  },
  components: {
    datepicker
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';

.add-operation-modal-header {
  font-size: 1.5rem;
  margin-bottom: 30px;
}
.add-operation-modal-form {
  display: flex;
  flex-direction: column;
}
.add-operation-modal-input-date{
  margin-bottom: 10px;
}
.add-operation-modal-input-operation {
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  color: $oplog-input-text-color;
  font-weight: 500;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  -webkit-appearance: none;
  font-size: 1rem;
  border: 1px solid $oplog-input-border-color;
  border-radius: 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  &:hover {
    border-color: $oplog-input-border-color-hover;
  }
  &:focus {
    border-color: $oplog-input-border-color-focus;
  }
}
.icd-selector {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-bottom: 10px;
  height: 0;
  overflow: scroll;
  -webkit-transition: height 0.2s;
  transition: height 0.2s;
  > .icd-selector-item {
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px solid $oplog-border-light;
  }
  > .icd-selector-item:hover {
    background: $oplog-light-light-gray;
  }
  .icd-selector-content {
    color: $oplog-gray;
    width:auto;
    align-self: center;
    margin-top: auto;
    margin-bottom: auto;
  }
  &.show {
    height: 200px;
    border: 1px solid $oplog-border-light;
    border-top: none;
  }
}
.opass-radio {
  cursor: pointer;
  position: relative;
	display: block;
  padding-left: 30px;
  margin-bottom: 10px;
  > input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  > .radio-indicator {
    position: absolute;
    top: 0px;
    left: 0;
    width: 20px;
    height: 20px;
    background: #e6e6e6;
    border-radius: 50%;
  }
  > .radio-indicator:after {
    top: 7px;
    left: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: black;
    position: absolute;
    display: none;
    content: '';
  }
  > input:checked ~ .radio-indicator:after {
    display: block;
  }
}
.add-operation-modal-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
  & > * {
    width: auto;
  }
}
.close-button {
  margin-right: 10px;
}
</style>
