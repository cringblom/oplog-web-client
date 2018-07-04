<template lang="pug">
  transition(name='modal')
    div.modal-mask(@mousedown.self='close')
      div.modal-container.modal-container-green
        div.modal-header
          div
            button.oplog-button.oplog-button-default(v-if='stepIndex > 0' @click='stepIndex--')
              font-awesome-icon(:icon='chevronLeft' style='margin-right: 5px')
              span Tillbaka
          div
            span.modal-title {{modalTitle}}
          div
            button.modal-close-button(@click='close') &times;
        transition(name='fade' mode='out-in')
          //Step 1: Operation
          div.modal-content(v-if='stepIndex === 0' key='step0')
            input.operation-input(
              v-model='icdInput'
              ref='icdInput'
              placeholder='Sök operation'
              @keyup.down.stop='icdSlectorDownKey'
              @keyup.up.stop='icdSlectorUpKey'
              @keyup.enter.stop='icdSelectorEnterKey')
            div.icd-selector
              div.icd-selector-content(v-if='filteredIcdCodes.length == 0 && icdInput.length == 0') Sök operation ovan
              div.icd-selector-content(v-else-if='filteredIcdCodes.length == 0') Hittade tyvärr inget :/
              div.icd-selector-item(
                v-else
                v-for='(icdCode, index) in filteredIcdCodes'
                :class='{"icd-selector-item-selected": index == icdSelectorSelectedIndex}'
                @click='selectedIcd = icdCode; stepIndex++  '
                @mouseover='icdSelectorSelectedIndex = index') {{icdCode.icd}} {{icdCode.name}}
            div.modal-info Sök och välj en operation ovan.
          //Step 2: Date
          div.modal-content(v-if='stepIndex === 1' key='step1')
            div.date-picker-wrapper
              date-picker(v-model='date'
                @input='stepIndex++'
                is-inline
                is-expanded
                :attributes='datePickerAttributes'
                :max-date='new Date()'
                :theme-styles='datePickerSyle')
            div.modal-info Klicka på datumet operationen utfördes.
          //Step 3: Op/Ass
          div.modal-content(v-if='stepIndex === 2' key='step2')
            div.op-ass-selector
              button.op-ass-button.op-ass-button-green(@click='mainOperator = true; submit()')
                div.op-ass-button-icd {{selectedIcd.icd}}
                div.op-ass-button-date {{formatedDate}}
                div Operatör
              button.op-ass-button.op-ass-button-yellow(@click='mainOperator = false; submit()')
                div.op-ass-button-icd {{selectedIcd.icd}}
                div.op-ass-button-date {{formatedDate}}
                div Assistent
</template>

<script>
import IcdLibrary from '../assets/IcdLibrary.js'
import moment from 'moment'
import axios from 'axios'
import {setupCalendar, DatePicker} from 'v-calendar'
import fontAwesomeIcon from '@fortawesome/vue-fontawesome'
import chevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft'
import 'v-calendar/lib/v-calendar.min.css'
export default {
  data() {
    return {
      stepIndex: 0,
      icdInput: '',
      selectedIcd: undefined,
      date: new Date(),
      mainOperator: undefined,
      isLoading: false,
      icdSelectorSelectedIndex: 0,
      datePickerAttributes: [
        {
          key: 'today',
          dot: {
            backgroundColor: '#ff4d4d'
          },
          dates: new Date()
        }
      ],
      datePickerSyle: {
        wrapper: {
          background: 'white',
          border: 'solid 1px rgb(233, 233, 233)',
          borderRadius: '4px'
        },
        weekdays: {
          fontSize: '1.1rem'
        },
        dayContent: {
          fontSize: '1.1rem'
        }
      }
    }
  },
  methods: {
    close: function() {
      this.$store.commit('hideAddOperationModal')
    },
    submit: function() {
      console.log("SUbmit");
      this.isLoading = true
      var newOperation = {
        icd: this.selectedIcd.icd,
        date: moment(this.date).format('YYYY-MM-DD'),
        mainOperator: this.mainOperator
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
    },
    icdSlectorDownKey: function() {
      if (this.icdSelectorSelectedIndex < this.filteredIcdCodes.length-1) {
        this.icdSelectorSelectedIndex++
      }
    },
    icdSlectorUpKey: function() {
      if (this.icdSelectorSelectedIndex > 0) {
        this.icdSelectorSelectedIndex--
      }
    },
    icdSelectorEnterKey: function() {
      this.selectedIcd = this.filteredIcdCodes[this.icdSelectorSelectedIndex]
      this.$refs.icdInput.blur()
    }
  },
  computed: {
    chevronLeft: function() {
      return chevronLeft
    },
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
    modalTitle: function() {
      if (this.stepIndex === 0) {
        return 'Välj operation'
      }
      if (this.stepIndex === 1) {
        return 'Välj datum'
      }
      return 'Välj delaktighet'
    },
    formatedDate: function() {
      return moment(this.date).format('YYYY-MM-DD')
    }

  },
  created: function() {
    setupCalendar({
      locale: 'sv-SE',
      firstDayOfWeek: 2,
      datePickerShowDayPopover: false
    })
  },
  mounted: function() {
    this.$refs.icdInput.focus()
  },
  watch: {
    icdInput: function() {
      this.icdSelectorSelectedIndex = 0
    }
  },
  components: {
    DatePicker,
    fontAwesomeIcon
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave {
  opacity: 1;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.1s ease;
}

.modal-content {
  display: flex;
  flex-direction: column;
  @media all and(min-width: $oplog-width-breakpoint) {
    margin-top: auto;
    margin-bottom: auto;
  }
  .modal-info {
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    color: $oplog-gray
  }
}
.operation-input {
  flex: 1 0 40px;
  padding-left: 10px;
  padding-right: 10px;
  margin: 0;
  color: $oplog-input-text-color;
  font-weight: 500;
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
  flex: 1 0 200px;
  border: 1px solid $oplog-border-light;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-bottom: 10px;
  overflow: scroll;
}
.icd-selector-item {
  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: 1px solid $oplog-border-light;
  &:hover {
    //background: $oplog-light-light-gray;
  }
  &.icd-selector-item-selected {
    background: $oplog-light-light-gray;
  }
}
.icd-selector-content {
  color: $oplog-gray;
  width:auto;
  align-self: center;
  margin-top: auto;
  margin-bottom: auto;
}
.date-picker-wrapper {
  flex: 1;
}
.op-ass-selector {
  display: flex;
  > * {
    flex: 1;
    margin-right: 20px;
  }
  > *:last-child {
    margin-right: 0;
  }
  .op-ass-button {
    height: 200px;
    border: 1px solid;
    border-radius: 4px;
    outline: none;
    text-decoration: none;
    background: white;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 10px;
    > * {
      margin-bottom: 5px;
    }
    > *:last-child {
      margin-bottom: 0;
    }
    &.op-ass-button-green {
      color: $oplog-green;
      border-color: mix(white, $oplog-green, 50%);
      background: mix(white, $oplog-green, 95%);
      &:hover {
        border-color: $oplog-green;
        background: mix(white, $oplog-green, 90%);
      }
    }
    &.op-ass-button-yellow {
      color: $oplog-yellow;
      border-color: mix(white, $oplog-yellow, 50%);
      background: mix(white, $oplog-yellow, 95%);
      &:hover {
        border-color: $oplog-yellow;
        background: mix(white, $oplog-yellow, 90%);
      }
    }
    .op-ass-button-icd {
      font-size: 1.5rem;
      font-weight: 500;
    }
  }
}
</style>
