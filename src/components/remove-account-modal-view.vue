<template lang="pug">
  transition(name='modal')
    div.modal-mask(@click.self='close')
      div.modal-container.modal-container-red
        div.modal-header Ta bort konto
        form.modal-body(@submit.prevent='submit')
          input.oplog-input.email-input(v-model='email' placeholder='Epost')
          div.info Ange din epostadress ovan för att bekräfta att du vill ta bort ditt konto. Tänk på att alla dina operationer och personuppgifter kommer att raderas och går inte att återskapa.
          div.modal-buttons
            button.oplog-button.oplog-button-default.close-button(type='button' @click='close') Avbryt
            button.oplog-button.oplog-button-default.submit-button(:disabled='disabledSubmitButton') Ta bort konto
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
  methods: {
    close: function() {
      this.$store.commit('hideRemoveAccountModal')
    },
    submit: function() {
      this.isLoading = true
      axios.delete("/api/v1/user")
      .then(() => {
        this.$router.push('/login', {username: this.email})
      })
      .catch((err) => {
        this.isLoading = false
        console.log(err)
        console.log(err.response)
      })
    }
  },
  computed: {
    disabledSubmitButton: function() {
      if (this.isLoading) {
        return true
      }
      if (this.email.length > 0) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../style-variables';

.modal-body {
  display: flex;
  flex-direction: column;
  > .email-input {
    margin-bottom: 10px;
  }
  > .info {
    text-align: center;
    font-size: 0.9rem;
    color: rgb(84, 84, 84);
  }
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
  & > * {
    width: auto;
  }
}
.close-button {
  margin-right: 10px;
}
</style>
