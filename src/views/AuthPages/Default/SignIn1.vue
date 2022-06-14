<template>
  <div>
    <h1 class="mb-0">Iniciar Sesión</h1>
    <p>Ingresa tus credenciales.</p>
    <sign-in1-form></sign-in1-form>
  </div>
</template>

<script>
import auth0 from 'auth0-js'
import SignIn1Form from './Forms/SignIn1Form'
import constant from '../../../config/constant'
import auth from '@/logic/auth'

export default {
  name: 'SignIn1',
  components: { SignIn1Form },
  data: () => ({}),
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    const loggedIn = localStorage.getItem('access_token')
    if (loggedIn !== undefined && loggedIn !== null) {
      if (this.userLogged.profiles.length > 0) {
        if (this.userLogged.profiles.length > 0 && this.userLogged.profiles[0].prof_id === 11) {
          this.$router.push({ name: 'cases.mylist' })
        } else {
          this.$router.push({ name: 'dashboard.home-1' })
        }
      } else {
        this.$router.push({ name: 'auth1.sign-in1' })
      }
    }
  },
  methods: {
    loginOAuth0: function () {
      new auth0.WebAuth(constant.auth0Config).authorize()
    }
  }
}
</script>
