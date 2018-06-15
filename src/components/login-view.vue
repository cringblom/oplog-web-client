<template lang="pug">
div.container
  notifications(position='top center' group='login-notifications' classes='oplog-notification' width='300px')
  div.main
    div.left-section
      div.info-box
        img.logo(src='../assets/scalpel-icon-white-nobg.svg')
        div.title-text Välkommen till oplog.se!
        div.subtitle-text Din operationslogg i molnet
    div.right-section
      form.login-box(@submit.prevent="login")
        div.login-title Logga in
        input.oplog-input(placeholder='Epost' v-model='email' type='email' style='margin-bottom: 10px;')
        input.oplog-input(placeholder='Lösenord' type='password' v-model='password' style='margin-bottom: 10px;')
        button.oplog-button.oplog-button-default(:disabled="loginButtonDisabled") {{loginButtonText}}
        div.separator
        button.oplog-button.oplog-button-sm.oplog-button-default(@click="$router.push('/register')" type='button') Skapa ett konto
  div.footer
    div.footer-left-section
      span © 2018 oplog.se
    div.footer-right-section
      span.footer-link(@click="$router.push('/forgot')") Glömt lösenord?
      span.footer-separator |
      span.footer-link Om
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
            message = 'Fel e-postaddress eller lösenord'
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
          text: 'Du måste ange din e-postaddress och lösenord',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

@import '../style-variables';

$width-breakpoint: 800px;

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
  width: 100%;
  @media all and (max-width: $width-breakpoint) {
    flex-direction: column-reverse;
  }
}
.main > * {
  flex: 1 100%
}
.left-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background-color: $oplog-green;
  color: white;
}
.info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
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
}
.right-section {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  width: 100%;
  max-width: 400px;
  .login-title {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  .separator {
    width: 50%;
    height: 1px;
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: $oplog-border-light;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  color: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  margin-top: auto;
  .footer-left-section {
    margin-left: 20px;
  }
  .footer-right-section {
    margin-right: 20px;
  }
  .footer-link {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .footer-separator {
    margin-left: 4px;
    margin-right: 4px;
  }
}

</style>
