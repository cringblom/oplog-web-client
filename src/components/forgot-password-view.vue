<template lang="pug">
  div.container
    div.left-box
      div.title Glömt lösenordet?
      div.subtitle Ingen fara. Ange bara din epostadress här. En länk kommer att skickas till dig. Klicka på länken för att återställa lösenordet.
    div.right-box
      el-input.email-input(placeholder='Din epostadress' v-model='email' type='email')
      el-button(@click='restorePassword' :disabled='isLoading') {{restoreButtonText}}
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
    restoreButtonText: function() {
      if (this.isLoading) {
        return 'Aterställer lösenordet...'
      }
      return 'Återställ lösenord'
    }
  },
  methods: {
    restorePassword: function() {
      if (!this.email) {
        return this.$message({
          message: 'Ange en giltig epostadress...',
          type: 'error',
          showClose: true
        })
      }
      this.isLoading = true
      axios.post('/api/v1/forgot', {
        email: this.email
      })
      .then(() => {
        return this.$message({
          message: 'Ett mail är skickat till dig med en länk. Klicka på länken för att återställa lösenordet!',
          type: 'success',
          showClose: true,
          duration: 0
        })
      })
      .catch((err) => {
        this.isLoading = false
        var aMessage = 'Ett fel uppstod, försök igen...'
        if (err.response.data.errorCode === 'EmailNotFound') {
          aMessage = 'Epostadressen verkar inte vara registrerad på oplog.se...'
        }
        if (err.response.data.errorCode === 'EmailSyntaxInvalid') {
          aMessage = 'Ange en giltig epostadress...'
        }
        return this.$message({
          message: aMessage,
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
}
.right-box {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 15px;
  .email-input {
    margin-bottom: 15px;
    font-size: 18px;
    height: 40px;
  }
}
</style>
