<template lang="pug">
div.oplog-login-container
  notifications(position='top center' group='verify-notifications' classes='oplog-notification' width='300px')
  div.oplog-login-content
    div.oplog-login-left-section
      div.oplog-login-left-section-content
        div.title(v-if='isNewUser') Snart klar!
        div.title(v-if='!isNewUser') Återställ lösenord
        div.subtitle Ange ett lösenord och bekräfta.
    div.oplog-login-right-section(v-if='!error')
      div.oplog-login-right-section-title Ange lösenord
      form.oplog-login-right-section-content(@submit.prevent="verify")
        input.oplog-input(v-model='email' disabled type='email')
        input.oplog-input(placeholder='Lösenord' v-model='password' type='password')
        input.oplog-input(placeholder='Upprepa lösenordet' v-model='passwordRepeat' type='password')
        button.oplog-button.oplog-button-default(:disabled='isLoading') {{verifyButtonText}}
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
        return 'Återställ lösenord'
      }
    }
  },
  methods: {
    fetchUsername: function() {
      axios.get('/api/v1/verify-account/' + this.$route.params.token)
      .then((res) => {
        this.email = res.data.username
        this.isNewUser = res.data.isNewUser
      })
      .catch((err) => {
        if (err.response.data.errorCode === 'InvalidRegistrationToken') {
          this.error = true
          this.errorMessage = 'Ett fel uppstod. Registreringensnummret verkar inte vara giltigt. Detta kan bero på att det gått för lång tid sedan du registrerade dig. Försök därför att registrera dig igen.'
        }
        console.log(err);
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
      .catch((err) => {
        console.log(err);
        this.isLoading = true
        this.$message({
          message: 'Ett fel uppstod, försök igen...',
          type: 'error',
          showClose: true
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
