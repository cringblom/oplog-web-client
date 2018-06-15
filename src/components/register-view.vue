<template lang="pug">
  div.register-container
    notifications(position='top center' group='register-notifications' classes='oplog-notification' width='300px')
    div.register-header
      img.logo(src='../assets/scalpel-icon-white-nobg.svg')
    div.register-content
      div.left-box(v-if='$route.name == "register-route"')
        div.title Att skapa ett konto är enklare än att operera!
        div.subtitle Du behöver bara ange din epostadress. Ett mail kommer sedan att skickas till dig med en länk för att starta kontot.
        div.subtitle Ett tips är att använda en personlig epostadress om du någon gång skulle byta arbetsgivare.
        div.subtitle
          span Genom att skapa ett konto godkänner du
          span.user-agreement-link(@click='$router.push("/user-agreement")')  användarvilkoren
          span .
        div.subtitle OpLog är helt gratis!
      div.left-box(v-if='$route.name == "forgot-password-route"')
        div.title Glömt lösenordet?
        div.subtitle Ingen fara. Ange bara din epostadress här. En länk kommer att skickas till dig. Klicka på länken för att återställa lösenordet.
      div.right-box
        input.oplog-input.email-input(placeholder='Din epostadress' v-model='email' type='email')
        button.oplog-button.oplog-button-default(@click='register' :disabled='isLoading') {{registerButtonText}}
    div.footer
      div.footer-left-section
        span © 2018 oplog.se
      div.footer-right-section
        span.footer-link(@click='$router.push("/login")') Tillbaka till oplog.se
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
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: $oplog-green;
  color: white
}
.register-header {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: auto;
  height: 60px;
  width: 100%;
  .logo {
    height: 50px;
    width: 50px;
    margin-left: 5px;
  }
}
.register-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
  @media all and (max-width: $oplog-width-breakpoint) {
    flex-direction: column;
    padding: 15px;
  }
}
.register-content > * {
  flex: 1 100%;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
.title {
  font-size: 2.2rem;
  font-weight: 500;
  margin-bottom: 10px;
}
.subtitle {
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
.footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  height: 60px;
  width: 100%;
  padding-bottom: 10px;
  box-sizing: border-box;
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
}
.modal-mask {
  color: $oplog-font-color;
}
</style>
