import axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL
})
const Auth = {
  checkTokenExpiration () {
    const token = localStorage.getItem('access_token')
    if (!token) {
      this.logoutAndRedirect()
      return
    }

    axios.get('/auth/user').catch(error => {
      if (error.response && error.response.status === 401) {
        this.logoutAndRedirect()
      }
    })
  },

  logoutAndRedirect () {
    localStorage.removeItem('access_token')
    document.cookie = 'mySession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    if (router.history.current.fullPath !== '/auth/sign-in1') {
      router.push('/auth/sign-in1')
    }
  },
  login (userData) {
    return axios.post('/api/login', userData)
  },
  register (userData) {
    return axios.post('/api/register', userData)
  }
}

export default Auth
