import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/sv-SE'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Router)
Vue.use(ElementUI, {locale})

import App from './App.vue'

//VUEX -------------------------------------------------------------------------
import _ from 'lodash'
import IcdLibrary from './assets/IcdLibrary.js'
import axios from 'axios'
import Cookies from 'js-cookie'
const store = new Vuex.Store({
  state: {
    operations: [],
    username: '',
    isAuthenticated: !!Cookies.get('oplog.sid'),
    addOperationModalIsVisible: false,
    loadingOperations: false
  },
  mutations: {
    setOperations: function(state, newOperations) {
      var sortedNewOperations = _.sortBy(newOperations, function(operation) {
        var miliseconds = new Date(operation.date).getTime()
        return -miliseconds
      })
      state.operations = sortedNewOperations
    },
    addOperation: function(state, newOperation) {
      var indexToInsert = _.sortedIndexBy(state.operations, newOperation, function(operation) {
        var miliseconds = new Date(operation.date).getTime()
        return -miliseconds
      })
      state.operations.splice(indexToInsert, 0, newOperation)
    },
    removeOperation: function(state, id) {
      var index = _.findIndex(state.operations, function(operation) {
        return id === operation._id
      })
      state.operations.splice(index, 1)
    },
    showAddOperationModal: function(state) {
      if (!state.addOperationModalIsVisible) {
        state.addOperationModalIsVisible = true
      }
    },
    hideAddOperationModal: function(state) {
      if (state.addOperationModalIsVisible) {
        state.addOperationModalIsVisible = false
      }
    },
    setAuthenticationState: function(state, newAuthenticationState) {
      if (state.isAuthenticated != newAuthenticationState) {
        state.isAuthenticated = newAuthenticationState
        if (state.isAuthenticated === false) {
          Cookies.remove('oplog.sid')
          state.username = ''
          state.operations = []
        }
      }
    },
    setLoadingOperationsState: function(state, newLoadingOperationsState) {
      state.loadingOperations = newLoadingOperationsState
    }

  },
  getters: {
    icdGroups: function(state) {
      var uniqueIcdOperations = _.uniqBy(state.operations, 'icd')
      var icdGroups = _.map(uniqueIcdOperations, function(operation) {
        return {
          icd: operation.icd,
          name: IcdLibrary.nameForIcd(operation.icd),
          count: {
            op: _.filter(state.operations, function(anotherOperation) {return anotherOperation.icd.toLowerCase() === operation.icd.toLowerCase() && anotherOperation.mainOperator === true}).length,
            ass: _.filter(state.operations, function(anotherOperation) {return anotherOperation.icd.toLowerCase() === operation.icd.toLowerCase() && anotherOperation.mainOperator === false}).length
          }
        }
      })
      return _.orderBy(icdGroups, 'count', 'desc')
    },
    operationsCount: function(state) {
      return {
        op: _.filter(state.operations, function(operation) {return operation.mainOperator === true}).length,
        ass: _.filter(state.operations, function(operation) {return operation.mainOperator === false}).length
      }
    }
  },
  actions: {
    fetchUser: function(context) {
      return new Promise((resolve, reject) => {
        axios.get('/api/v1/user')
        .then((res) => {
          context.state.username = res.data.username
          resolve()
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            context.commit('setAuthenticationState', false)
          }
        })
      })
    },
    fetchOperations: function(context) {
      console.log('fetchOperations');
      context.commit('setLoadingOperationsState', true)
      axios.get('/api/v1/operations')
      .then((res) => {
        context.commit('setOperations', res.data)
        context.commit('setLoadingOperationsState', false)
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          context.commit('setLoadingOperationsState', false)
          context.commit('setAuthenticationState', false)
        }
      })
    },
    logout: function(context) {
      axios.post('/api/v1/logout')
      .then(() => {
        context.commit('setAuthenticationState', false)
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }
})
//ROUTER -----------------------------------------------------------------------
import loginView from "./components/login-view.vue"
import appView from "./components/app-view.vue"
import operationsView from './components/operations-view.vue'
import userView from './components/user-view.vue'
const router = new Router({
  routes: [
    {
      path: "/login",
      name: "login-route",
      component: loginView
    },
    {
      path: "/",
      name: "authenticated-route",
      component: appView,
      beforeEnter: function(to, from, next) {
        if (!store.state.isAuthenticated) {
          return next('/login')
        }
        store.dispatch('fetchOperations')
        next()
      },
      children: [
        {
          path: '/operations/:icd*',
          component: operationsView,
          name: 'operations'
        },
        {
          path: '/user',
          component: userView,
          name: 'user',
          beforeEnter: function(to, from, next) {
            store.dispatch('fetchUser')
            next()
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/operations'
    }
  ]
})

store.watch(function(state) {return state.isAuthenticated}, function(value) {
  if (value === false) {
    router.push('/login')
  }
})

//VUE
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
