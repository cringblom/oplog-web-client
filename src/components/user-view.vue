<template lang="pug">
  div.user-view-container
    div.title Konto
    div.border-box
      div.left-section
        span.username-label Inloggad som:
        span.username(data-cy='username-span')  {{username}}
        span.loading-user(v-if='loadingUser') laddar...
      div.right-section
        button.oplog-button.oplog-button-default(@click='logout' data-cy='logout-button') Logga ut
    div.border-box
      div.left-section
        span Ta bort konto
      div.right-section
        button.oplog-button.oplog-button-red(@click='$store.commit("showRemoveAccountModal")' data-cy='remove-account-button') Ta bort konto...
</template>

<script>
export default {
  data: function() {
    return {
      loadingUser: false,
      username: this.$store.state.username
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
    }
  },
  created: function() {
    this.loadingUser = true
    this.$store.dispatch('fetchUser')
    .then(() => {
      this.loadingUser = false
      this.username = this.$store.state.username
    })
    .catch((message) => {
      this.loadingUser = false
      this.username = undefined
      this.$notify({
        group: 'app-notifications',
        text: message,
        type: 'error',
      })
    })
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
.loading-user {
  color: $oplog-gray;
}
</style>
