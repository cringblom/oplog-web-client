<template lang="html">
<div class="header">
  <div class="left-header-section">
    <router-link :to="'/operations'" tag="div" class="oplog-brand">
      OpLog
    </router-link>
  </div>
  <div class="right-header-section">
    <el-button v-if="addButtonIsVissible" @click="showAddOperationModal">
      Lägg till operation...
    </el-button>
    <el-dropdown trigger="click">
      <span class="user-dropdown">
        USER
        <i class="el-icon-arrow-down"/>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <div @click="goToUserView">
            Konto
          </div>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <div @click="logout">
            Logga ut
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</div>
</template>

<script>
export default {
  computed: {
    addButtonIsVissible: function() {
      return this.$route.name === 'operations'
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
    },
    goToUserView: function() {
      this.$router.push('/user')
    },
    showAddOperationModal: function() {
      this.$store.commit('showAddOperationModal')
    }
  }
}
</script>

<style scoped lang="css">
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.right-header-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.oplog-brand {
  font-size: 1.5rem;
  font-weight: 500;
  color: rgb(102, 164, 72);
  cursor: pointer;
}
.user-dropdown {
  cursor: pointer;
  margin-left: 20px;
}
.el-icon-arrow-down {
    font-size: 12px;
  }
</style>
