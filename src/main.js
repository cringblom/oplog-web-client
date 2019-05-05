import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'

import './styles.scss'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Router)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import Notifications from 'vue-notification'
Vue.use(Notifications)

import App from './App.vue'

//VUEX -------------------------------------------------------------------------
import axios from 'axios'
import _ from 'lodash'
import IcdLibrary from './assets/IcdLibrary.js'
const store = new Vuex.Store({
  state: {
    operations: [],
    username: '',
    isAuthenticated: false,
    addOperationModalIsVisible: false,
    showLeftSection: false
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
          state.username = ''
          state.operations = []
          state.addOperationModalIsVisible = false
          state.removeAccountModalIsVisible = false
        }
      }
    },
    toggleLeftSection: function(state) {
      state.showLeftSection = !state.showLeftSection
    },
    setLeftSectionVisibility: function(state, visible) {
      state.showLeftSection = visible
    }
  },
  getters: {
    icdGroups: function(state) {
      var uniqueIcdOperations = _.uniqBy(state.operations, 'icd')
      var icdGroups = _.map(uniqueIcdOperations, function(operation) {
        return {
          icd: operation.icd.toUpperCase(),
          name: IcdLibrary.nameForIcd(operation.icd),
          count: {
            op: _.filter(state.operations, function(anotherOperation) {return anotherOperation.icd.toLowerCase() === operation.icd.toLowerCase() && anotherOperation.mainOperator === true}).length,
            ass: _.filter(state.operations, function(anotherOperation) {return anotherOperation.icd.toLowerCase() === operation.icd.toLowerCase() && anotherOperation.mainOperator === false}).length
          }
        }
      })
      return _.orderBy(icdGroups, function(icdGroup) {
        return icdGroup.count.op + icdGroup.count.ass
      }, 'desc')
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
          if (err.response) {
            if (err.response.status === 401) {
              context.commit('setAuthenticationState', false)
            } else if (err.response.status === 500) {
              reject('Ett fel uppstod. Försök igen.')
            }
          } else if (err.request) {
            reject('Det verkar inte finnas någon nätverksanslutning. Försök igen.')
          } else {
            reject('Ett fel uppstod. Försök igen')
          }
        })
      })
    },
    fetchOperations: function(context) {
      return new Promise(function(resolve, reject) {
        axios.get('/api/v1/operations')
        .then((res) => {
          context.commit('setOperations', res.data)
          resolve()
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              context.commit('setAuthenticationState', false)
              resolve()
            } else if (err.response.status === 500) {
              reject('Ett fel uppstod. Försök igen.')
            }
          } else if (err.request) {
            reject('Det verkar inte finnas någon nätverksanslutning. Försök igen.')
          } else {
            reject('Ett fel uppstod. Försök igen')
          }
        })
      })
    },
    addOperation: function(context, newOperation) {
      return new Promise(function(resolve, reject) {
        axios.post("/api/v1/operations", newOperation)
        .then((res) => {
          context.commit('addOperation', res.data)
          resolve()
        })
        .catch(function(err) {
          if (err.response) {
            if (err.response.status === 401) {
              context.commit('setAuthenticationState', false)
              resolve()
            } else if (err.response.status === 500) {
              reject('Ett fel uppstod. Försök igen.')
            }
          } else if (err.request) {
            reject('Det verkar inte finnas någon nätverksanslutning. Försök igen.')
          } else {
            reject('Ett fel uppstod. Försök igen')
          }
        })
      })
    },
    removeOperation: function(context, operationId) {
      return new Promise(function(resolve, reject) {
        axios.delete('/api/v1/operations/'+operationId)
        .then(() => {
          context.commit('removeOperation', operationId)
          resolve()
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              context.commit('setAuthenticationState', false)
              resolve()
            } else if (err.response.status === 400) {
              context.dispatch('fetchOperations')
              reject('Operationen verkar redan vara borttagen. Operationslistan har nu updaterats')
            } else if (err.response.status === 500) {
              reject('Ett fel uppstod. Försök igen.')
            }
          } else if (err.request) {
            reject('Det verkar inte finnas någon nätverksanslutning. Försök igen.')
          } else {
            reject('Ett fel uppstod. Försök igen')
          }
        })
      })
    },
    getAuthenticatedState: function(context) {
      return new Promise((resolve, reject) => {
        axios.get('/api/v1/authenticated-state')
        .then(() => {
          context.commit('setAuthenticationState', true)
          resolve()
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              context.commit('setAuthenticationState', false)
              return resolve()
            }
          }
          return reject(err)
        })
      })
    },
    logout: function(context) {
      axios.post('/api/v1/logout')
      .then(() => {
        context.commit('setAuthenticationState', false)
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            context.commit('setAuthenticationState', false)
          }
        }
        console.log(err);
      })
    }
  }
})

//ROUTER -----------------------------------------------------------------------
import loginView from "./components/login-view.vue"
import registerView from './components/register-view.vue'
import aboutView from './components/about-view.vue'
import verfiyAccountView from './components/verify-account-view.vue'
import appView from "./components/app-view.vue"
import operationsView from './components/operations-view.vue'
import userView from './components/user-view.vue'
import userAgreementView from './components/user-agreement-view.vue'
const router = new Router({
  routes: [
    {
      path: "/login",
      name: "login-route",
      component: loginView
    },
    {
      path: '/register',
      name: 'register-route',
      component: registerView
    },
    {
      path: '/verify/:token',
      name: 'verify-route',
      component: verfiyAccountView
    },
    {
      path: '/forgot',
      name: 'forgot-password-route',
      component: registerView
    },
    {
      path: '/user-agreement',
      name: 'user-agreement-route',
      component: userAgreementView
    },
    {
      path: '/about',
      name: 'about-route',
      component: aboutView
    },
    {
      path: "/",
      name: "authenticated-route",
      component: appView,
      redirect: {name: 'operations'},
      beforeEnter: function(to, from, next) {
        if (!store.state.isAuthenticated) {
          store.dispatch('getAuthenticatedState')
          .then(() => {
            if (!store.state.isAuthenticated) {
              return next('/login')
            }
            return next()
          })
          .catch(() => {
            return next()
          })
        } else {
          next()
        }
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
          name: 'user'
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
