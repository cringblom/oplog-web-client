<template lang="pug">
  transition(name='modal')
    div.modal-mask(@click.self='close')
      div.modal-container.modal-container-green
        div.modal-header Lägg till operation
        form.add-operation-modal-form(@submit.prevent='submit')
          div(style='width: 100%; height: 50px;')
            input.oplog-input.add-operation-modal-input-operation(v-model='icdInput' ref='icdInput' placeholder='Sök operation' @focus='icdDropdownIsVisible = true' @blur='icdDropdownIsVisible = false')
            div.dropdown(v-if='icdDropdownIsVisible')
              div.dropdown-no-items(v-if='filteredIcdCodes.length == 0') Hittade tyvärr inget :/
              div.dropdown-item(v-for='icdCode in filteredIcdCodes' @mousedown='selectedIcd = icdCode') {{icdCode.icd}} {{icdCode.name}}
          datepicker(v-model='date' monday-first=true input-class='oplog-input add-operation-modal-input-date')
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
import _ from 'lodash'
export default {
  data() {
    return {
      icdInput: '',
      icdDropdownIsVisible: false,
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
      if (this.icdInput.length < 3) {
        var topIcdCodes = this.$store.getters.icdGroups
        if (topIcdCodes.length > 0) {
          var topSevenIcdCodes = _.take(topIcdCodes, 7)
          return topSevenIcdCodes
        }
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

<style lang="scss">
@import '../style-variables';

.add-operation-modal-header {
  font-size: 1.5rem;
  margin-bottom: 30px;
}
.add-operation-modal-form {
  display: flex;
  flex-direction: column;
}
.add-operation-modal-input-operation, .add-operation-modal-input-date{
  margin-bottom: 10px;
}
.dropdown {
  z-index: 1;
  position: relative;
  top: 0;
  left: 0;
  background: white;
  border: 1px solid $oplog-light-gray;
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  > .dropdown-item {
    cursor: pointer;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
  }
  > .dropdown-item:hover {
    background: $oplog-light-gray;
  }
  > .dropdown-no-items {
    color: $oplog-gray;
    align-self: center;
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
