<template lang="html">
  <el-row type="flex" justify="center">
    <el-col :span="6">
      <el-row>
        <h2>Logga in</h2>
      </el-row>
      <el-row>
        <el-input placeholder="E-post" prefix-icon="el-icon-phone" v-model="email"></el-input>
        <el-input placeholder="Lösenord" prefix-icon="el-icon-view" type="password" v-model="password"></el-input>
      </el-row>
      <el-row>
        <el-button v-on:click="loginClick">
          Logga in
        </el-button>
      </el-row>
      <el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'
export default {
  data: function() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    loginClick: function() {
      axios.post('/api/v1/login', {
        username: this.email,
        password: this.password
      })
      .then(() => {
        this.$store.commit('setAuthenticationState', true)
        this.$router.push('/operations')
      })
      .catch((err) => {
        console.log("ERRROR");
        console.log(err)
        console.log(err.response);
      })
    }
  }
}
</script>
