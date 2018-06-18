<template lang="pug">
  div.oplog-login-container
    notifications(position='top center' group='register-notifications' classes='oplog-notification' width='300px')
    div.oplog-login-content
      div.oplog-login-left-section
        div.oplog-login-left-section-content(v-if='$route.name == "register-route"')
          div.title Att skapa ett konto går snabbare än bytestiderna på op!
          div.subtitle Du behöver bara ange din epostadress. Ett mail kommer sedan att skickas till dig med en länk för att starta kontot.
          div.subtitle Ett tips är att använda en personlig epostadress om du någon gång skulle byta arbetsgivare.
          div.subtitle
            span Genom att skapa ett konto godkänner du
            span.user-agreement-link(@click='$router.push("/user-agreement")')  användarvilkoren
            span .
          div.subtitle OpLog är helt gratis!
        div.oplog-login-left-section-content(v-if='$route.name == "forgot-password-route"')
          div.title Glömt lösenordet?
          div.subtitle Ingen fara. Ange bara din epostadress här. En länk kommer att skickas till dig. Klicka på länken för att återställa lösenordet.
      div.oplog-login-right-section
        div.oplog-login-right-section-title(v-if='$route.name == "register-route"') Registrera
        div.oplog-login-right-section-title(v-if='$route.name == "forgot-password-route"') Återställ lösenord
        div.oplog-login-right-section-content
          input.oplog-input.email-input(placeholder='Din epostadress' v-model='email' type='email')
          button.oplog-button.oplog-button-default(@click='register' :disabled='isLoading') {{registerButtonText}}
    div.oplog-login-footer
      div
        span © 2018 oplog.se
      div
        span.oplog-login-footer-link(@click='$router.push("/login")') Tillbaka till oplog.se
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      email: '',
      isLoading: false
    }
  },
  computed: {
    registerButtonText: function() {
      if (this.isLoading) {
        if (this.$route.name == 'register-route') {
          return 'Skapar konto...'
        }
        if (this.$route.name == 'forgot-password-route') {
          return 'Återställer lösenord...'
        }

      } else {
        if (this.$route.name == 'register-route') {
          return 'Skapa konto!'
        }
        if (this.$route.name == 'forgot-password-route') {
          return 'Återställ lösenord!'
        }
      }
    }
  },
  methods: {
    register: function() {
      this.isLoading = true
      var url
      if (this.$route.name == 'register-route') {
        url = '/api/v1/register'
      }
      if (this.$route.name == 'forgot-password-route') {
        url = '/api/v1/forgot'
      }
      axios.post(url, {
        email: this.email
      })
      .then(() => {
        this.$notify({
          group: 'register-notifications',
          text: 'Ett mail är på väg till dig med en länk. Klicka på länken för att gå vidare med registreringen. Du kan nu stänga detta fönster',
          type: 'info',
          duration: -1
        })
      })
      .catch((err) => {
        this.isLoading = false
        var aMessage = 'Ett fel uppstod, försök igen...'
        if (err.response.data.errorCode === 'EmailAlreadyInUse') {
          aMessage = 'Epostadressen används redan'
        }
        if (err.response.data.errorCode === 'EmailSyntaxInvalid' || err.response.data.errorCode === 'EmailRequired') {
          aMessage = 'Ange en giltig epostadress'
        }
        this.$notify({
          group: 'register-notifications',
          text: aMessage,
          type: 'error',
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.title {
  font-size: 2.2rem;
  font-weight: 500;
  margin-bottom: 10px;
  align-self: flex-start;
}
.subtitle {
  align-self: flex-start;
  font-size: 1rem;
  margin-bottom: 10px;
}
.user-agreement-link {
  cursor: pointer;
  text-decoration:underline;
  font-weight: 500;
}
.email-input {
  margin-bottom: 15px;
  font-size: 18px;
  height: 40px;
}
</style>
