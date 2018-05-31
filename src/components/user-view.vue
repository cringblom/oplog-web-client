<template lang="html">
  <el-main class="el-main">
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-row>
          <el-col :span="24" class="title">
            Konto
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="border-box">
            <div class="left-section">
              <span class="username-label">
                Inloggad som:
              </span>
              <span class="username">
                {{username}}
              </span>
            </div>
            <div class="right-section">
              <el-button @click="logout">
                Logga ut
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="border-box">
            <div>
              <span class="">
                Ta bort konto
              </span>
            </div>
            <div>
              <el-button plain type="danger">
                Ta bort konto...
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  computed: {
    username: function() {
      return this.$store.state.username || 'Ej inloggad '
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style scoped lang="css">
.el-main {
  margin-top: 60px;
}
.title {
  font-size: 2rem;
  margin-bottom: 20px;
}
.border-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 5px;
  padding: 20px;
  font-size: 1.2rem;
  margin-bottom: 20px;
}
.username {
  font-weight: 500;
}
</style>
