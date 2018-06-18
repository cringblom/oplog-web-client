<template lang="pug">
div.oplog-login-container
  notifications(position='top center' group='login-notifications' classes='oplog-notification' width='300px')
  div.oplog-login-content
    div.oplog-login-left-section
      div.oplog-login-left-section-content
        img.logo(src='../assets/scalpel-icon-white-nobg.svg')
        div.title-text Välkommen till oplog.se!
        div.subtitle-text Din operationslogg i molnet
    div.oplog-login-right-section
      div.oplog-login-right-section-title Logga in
      form.oplog-login-right-section-content(@submit.prevent="login")
        input.oplog-input(placeholder='Epost' v-model='email' type='email' style='margin-bottom: 10px;')
        input.oplog-input(placeholder='Lösenord' type='password' v-model='password' style='margin-bottom: 10px;')
        button.oplog-button.oplog-button-default(:disabled="loginButtonDisabled") {{loginButtonText}}
        div.login-form-button-separator
        button.oplog-button.oplog-button-sm.oplog-button-default(@click="$router.push('/register')" type='button') Skapa ett konto
  div.oplog-login-footer
    div
      span © 2018 oplog.se
    div
      span.oplog-login-footer-link(@click="$router.push('/forgot')") Glömt lösenord?
      span.footer-separator |
      span.oplog-login-footer-link Om
</template>

<script>
import axios from 'axios'
export default {
  data: function() {
    return {
      email: "",
      password: "",
      isLoggingIn: false
    }
  },
  computed: {
    loginButtonText: function() {
      if (this.isLoggingIn) {
        return 'Loggar in...'
      }
      return 'Logga in'
    },
    loginButtonDisabled: function() {
      return this.isLoggingIn
    }
  },
  methods: {
    login: function() {
      if (this.email && this.password) {
        this.isLoggingIn = true
        axios.post('/api/v1/login', {
          username: this.email,
          password: this.password
        })
        .then(() => {
          this.$store.commit('setAuthenticationState', true)
          this.$router.push('/operations')
          this.isLoggingIn = false
        })
        .catch((err) => {
          this.isLoggingIn = false
          var message
          if (err.response.status === 401) {
            message = 'Fel e-postadress eller lösenord'
          } else {
            message = 'Ett fel uppstod, försök igen'
          }
          this.$notify({
            group: 'login-notifications',
            text: message,
            type: 'error',
          })
        })
      } else {
        this.$notify({
          group: 'login-notifications',
          text: 'Du måste ange din e-postadress och lösenord',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

@import '../style-variables';

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 30px;
}
.title-text {
  font-weight: 500;
  font-size: 2rem;
  margin-bottom: 5px;
  text-align: center;
}
.subtitle-text {
  font-size: 1.3rem;
}
.login-form-button-separator {
  width: 50%;
  height: 1px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: $oplog-border-light;
}
.footer-separator {
  margin-left: 4px;
  margin-right: 4px;
}

</style>
