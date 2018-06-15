<template lang="pug">
  div.user-view-container
    div.title Konto
    div.border-box
      div.left-section
        span.username-label Inloggad som:
        span.username  {{username}}
      div.right-section
        button.oplog-button.oplog-button-default(@click='logout') Logga ut
    div.border-box
      div.left-section
        span Ta bort konto
      div.right-section
        button.oplog-button.oplog-button-red(@click='$store.commit("showRemoveAccountModal")') Ta bort konto...
</template>

<script>
export default {
  computed: {
    username: function() {
      return this.$store.state.username || 'Ej inloggad '
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.user-view-container {
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  padding: 20px;
  box-sizing: border-box;
  width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.title {
  font-size: 2rem;
  margin-bottom: 20px;
}
.border-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 5px;
  padding: 20px;
  font-size: 1.2rem;
  margin-bottom: 20px;
}
.username-label {
  @media screen and (max-width: $oplog-width-breakpoint) {
    display: none;
  }
}
.username {
  font-weight: 500;
}
</style>
