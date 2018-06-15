<template lang="pug">
  div.container
    div.left-box
      div.title(v-if='isNewUser') Snart klar!
      div.title(v-if='!isNewUser') Återställ lösenord
      div.subtitle Ange ett lösenord och bekräfta.
    form.right-box(@submit.prevent="verify")
      el-input.email-input(v-model='email' disabled type='email')
      el-input(placeholder='Lösenord' v-model='password' type='password')
      el-input(placeholder='Upprepa lösenordet' v-model='passwordRepeat' type='password')
      el-button(@click='verify' :disabled='isLoading') {{registerButtonText}}
      input(type='submit' hidden)
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
      isLoading: false
    }
  },
  created() {
    this.fetchUsername()
  },
  computed: {
    registerButtonText: function() {
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
        console.log(err);
      })
    },
    verify: function() {
      if (this.password != this.passwordRepeat) {
        return this.$message({
          message: 'Lösenorden måste stämma överens, försök igen...',
          type: 'error',
          showClose: true
        })
      }
      if (!this.password || this.password.length < 6 || this.password.length > 20) {
        return this.$message({
          message: 'Lösenordet måste vara mellan 6-20 tecken, försök igen...',
          type: 'error',
          showClose: true
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
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: $oplog-green;
  color: white
}
.left-box {
  display: flex;
  flex-direction: column;
  padding: 15px;
  width: 400px;
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
  }
}
.right-box {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 15px;
  > * {
    margin-bottom: 15px;
  }
}
</style>
