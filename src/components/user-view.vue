<template lang="pug">
  div.user-view-container
    div.title Konto
    div.border-box
      div.border-box-row
        div.left-section
          span.username-label Inloggad som:
          span.username(data-cy='username-span')  {{username}}
          span.loading-user(v-if='loadingUser') laddar...
        div.right-section
          button.oplog-button.oplog-button-default(@click='logout' data-cy='logout-button') Logga ut
    div.border-box
      div.border-box-row
        div.left-section
          span Ta bort konto
        div.right-section
          button.oplog-button.oplog-button-red(@click='showRemoveAccountBox=true' v-if='!showRemoveAccountBox' data-cy='remove-account-toggle-button') Ta bort konto...
      div.border-box-row
        div.remove-account-box(v-if='showRemoveAccountBox')
          span Ange din epostadress nedan för att bekräfta att du vill ta bort ditt konto. Tänk på att alla dina operationer och personuppgifter kommer att raderas och går inte att återskapa. 
          input.oplog-input(placeholder='E-post' v-model='email' data-cy='remove-account-email-input')
          button.oplog-button.w-100.oplog-button-red(@click='submit()' data-cy='remove-account-submit-button') Ta bort konto
</template>

<script>
import axios from 'axios'
export default {
  data: function() {
    return {
      loadingUser: false,
      username: this.$store.state.username,
      showRemoveAccountBox: false,
      email: '',
      isLoadingRemoveAccount: false
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
    },
    submit: function() {
      this.isLoadingRemoveAccount = true
      axios.delete("/api/v1/user", {
        params: {
          email: this.email
        }
      })
      .then(() => {
        this.$store.commit('setAuthenticationState', false)
        this.$router.push('/login')
      })
      .catch((err) => {
        this.isLoadingRemoveAccount = false
        if (err.response.data.errorCode === 'EmailRequiredError') {
          return this.$notify({
            group: 'app-notifications',
            text: 'Fel epostadress',
            type: 'error'
          })
        }
        this.$notify({
          group: 'app-notifications',
          text: 'Ett fel uppstod, försök igen...',
          type: 'error'
        })
      })
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
  flex-direction: column;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 5px;
  padding: 20px;
  font-size: 1.2rem;
  margin-bottom: 20px;
}
.border-box-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.remove-account-box {
  display: flex;
  flex-direction: column;
  > * {
    margin-top: 10px;
  }
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
