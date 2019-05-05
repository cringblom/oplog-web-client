<template lang="pug">
div.oplog-login-container
  notifications(position='top center' group='verify-notifications' classes='oplog-notification' width='300px')
  div.loading-content(v-if='isLoadingUser === true')
    div.loading-text Laddar...
  div.error-content(v-else-if='error === true')
    div.error-title Ett fel uppstod
    div.error-message {{errorMessage}}
  div.oplog-login-content(v-else)
    div.oplog-login-left-section
      div.oplog-login-left-section-content
        div.title(v-if='isNewUser') Snart klar!
        div.title(v-if='!isNewUser') Återställ lösenord
        div.subtitle Ange ett lösenord och bekräfta.
    div.oplog-login-right-section(v-if='!error')
      div.oplog-login-right-section-title Ange lösenord
      form.oplog-login-right-section-content(@submit.prevent="verify")
        input.oplog-input(v-model='email' disabled type='email' data-cy='verify-email-input')
        input.oplog-input(placeholder='Lösenord' v-model='password' type='password' data-cy='verify-password-input')
        input.oplog-input(placeholder='Upprepa lösenordet' v-model='passwordRepeat' type='password' data-cy='verify-password-repeat-input')
        button.oplog-button.oplog-button-default.w-100(:disabled='isLoading' data-cy='verify-submit-button') {{verifyButtonText}}
    div.oplog-login-right-section(v-if='error')
      div.oplog-login-right-section-content.error {{errorMessage}}
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      password: '',
      passwordRepeat: '',
      email: '',
      isNewUser: false,
      isLoading: false,
      isLoadingUser: false,
      error: false,
      errorMessage: ''
    }
  },
  created() {
    this.fetchUsername()
  },
  computed: {
    verifyButtonText: function() {
      if (this.isNewUser) {
        if (this.isLoading) {
          return 'Skapar konto...'
        }
        return  'Skapa konto och logga in!'
      } else {
        if (this.isLoading) {
          return 'Återställer lösenordet...'
        }
        return 'Bekräfta och logga in!'
      }
    }
  },
  methods: {
    fetchUsername: function() {
      this.isLoadingUser = true
      axios.get('/api/v1/verify-account/' + this.$route.params.token)
      .then((res) => {
        this.isLoadingUser = false
        this.email = res.data.username
        this.isNewUser = res.data.isNewUser
      })
      .catch((err) => {
        this.isLoadingUser = false
        this.error = true
        if (err.response.data.errorCode === 'InvalidTokenError') {
          this.errorMessage = 'Din verifieringskod är inte giltig. Detta kan bero på att det gått mer än 24 timmar sedan du registrerat dig eller återställt ditt lösenord. Du behöver då göra om det.'
        } else {
          this.errorMessage = 'Ett fel uppstod. Försök igen...'
        }
      })
    },
    verify: function() {
      if (this.password != this.passwordRepeat) {
        return this.$notify({
          group: 'verify-notifications',
          text: 'Lösenorden måste stämma överens, försök igen...',
          type: 'error'
        })
      }
      if (!this.password || this.password.length < 6 || this.password.length > 20) {
        return this.$notify({
          group: 'verify-notifications',
          text: 'Lösenordet måste vara mellan 6-20 tecken, försök igen...',
          type: 'error'
        })
      }
      this.isLoading = true
      axios.post('/api/v1/verify-account/' + this.$route.params.token, {
        password: this.password
      })
      .then(() => {
        this.$store.commit('setAuthenticationState', true)
        this.$router.push('/operations')
      })
      .catch(() => {
        this.isLoading = true
        return this.$notify({
          group: 'verify-notifications',
          text: 'Ett fel uppstod, försök igen...',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';
.loading-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.loading-text {
  font-size: 1.5rem;
  color: $oplog-gray;
}
.error-content {
  height: 100%;
  margin-right: 20px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.error-title {
  color: $oplog-gray;
  font-size: 1.5rem;
  margin-bottom: 10px;
}
.error-message {
  color: $oplog-gray;
  font-size: 1.1rem;
  text-align: center;
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
.oplog-login-right-section-content > input {
  margin-bottom: 10px;
}
.error {
  color: rgb(136, 136, 136);
}
</style>
