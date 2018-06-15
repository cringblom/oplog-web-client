<template lang="pug">
div.header-view-container
  div.header-view-left-section(@click='$router.push("/operations")')
    img.oplog-icon(src='../assets/scalpel-icon-white-greenbg.svg')
    div.oplog-brand OpLog
  div.header-view-right-section
    button.oplog-button.oplog-button-default.add-operation-button(v-if="addButtonIsVissible" @click="showAddOperationModal")
      font-awesome-icon.plus-icon(:icon='plusIcon')
      span.add-operation-button-text Lägg till operation...
    v-popover
      span.user-dropdown-button(style="outline: none;")
        font-awesome-icon.user-icon(:icon="userIcon")
        font-awesome-icon.user-icon(:icon="caretDownIcon")
      template(slot='popover')
        div.user-dropdown-content
          div(@click='$router.push("/user")' v-close-popover) Konto
          div(@click='logout' v-close-popover) Logga ut
</template>

<script>
import fontAwesomeIcon from '@fortawesome/vue-fontawesome'
import userIcon from '@fortawesome/fontawesome-free-solid/faUser'
import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown'
import plusIcon from '@fortawesome/fontawesome-free-solid/faPlus'

export default {
  computed: {
    addButtonIsVissible: function() {
      return this.$route.name === 'operations'
    },
    userIcon: function() {
      return userIcon
    },
    caretDownIcon: function() {
      return caretDownIcon
    },
    plusIcon: function() {
      return plusIcon
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
    },
    showAddOperationModal: function() {
      this.$store.commit('showAddOperationModal')
    }
  },
  components: {
    fontAwesomeIcon
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.user-dropdown-content {
  display: flex;
  flex-direction: column;
  width: 150px;
  & > * {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    cursor: pointer;

  }
  & > *:hover {
    background: white;
    color: black;
  }
}
.header-view-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-view-right-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .plus-icon {
    color: $oplog-green;
    @media screen and (min-width: $oplog-width-breakpoint) {
      margin-right: 5px;
    }
  }
  .add-operation-button-text {
    @media screen and (max-width: $oplog-width-breakpoint) {
      display: none;
    }
  }
}
.add-operation-button {
  margin-right: 20px;
}
.user-dropdown-button {
  display: flex;
  cursor: pointer;
}
.header-view-left-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  > .oplog-icon {
    width: 40px;
    margin-right: 10px;
    //height: 50px;
  }
  > .oplog-brand {
    font-size: 1.5rem;
    font-weight: 500;
    color: $oplog-green;
    @media screen and (max-width: $oplog-width-breakpoint) {
      display: none;
    }
  }
}

.user-dropdown {
  cursor: pointer;
  margin-left: 20px;
}
.user-icon {
  margin-right: 3px;
}
.el-icon-arrow-down {
    font-size: 12px;
  }
</style>
