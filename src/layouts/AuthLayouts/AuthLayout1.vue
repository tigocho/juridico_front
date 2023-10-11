<template>
  <div>
    <Loader />
    <section class="sign-in-page">
      <b-container class="sign-in-page-bg mt-5 p-0">
        <div class="row no-gutters">
          <div class="col-md-6 text-center position-relative">
            <div class="sign-in-detail text-white">
              <Slick :option="slickOptions">
                <div class="item">
                  <img :src="require('../../assets/images/login/juridico-logo.png')" class="img-fluid larger-logo" alt="logo">
                  <p>Brindamos soluciones con respaldo generando seguridad y confianza.</p>
                </div>
              </Slick>
              <img :src="logo" class="img-fluid logo-gocho" alt="logo">
            </div>
          </div>
          <div class="col-md-6 position-relative">
            <div class="sign-in-from">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </b-container>
    </section>
    <!-- Footer con copyright -->
    <footer class="text-center mt-4 d-flex justify-content-center">
      <p class="mb-0 mr-2">© {{ new Date().getFullYear() }} Todos los derechos reservados. © JurídicoApp creado por <a href="https://gocho.com.co" target="_blank">Gocho</a> | <a href="#" class="terms-conditions">Términos y condiciones</a></p>

    </footer>
  </div>
</template>
<script>
import Loader from '../../components/xray/loader/Loader'
import logo from '../../assets/images/logo-nueva.png'
import { xray } from '../../config/pluginInit'
import bgImage from '../../assets/images/login/2.png'
export default {
  name: 'AuthLayout1',
  components: {
    Loader
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      slickOptions: {
        slidesToShow: 1,
        arrows: false,
        dots: false
      },
      logo: logo,
      bgImageURL: bgImage
    }
  }
}
</script>
<style scoped>
.logo-gocho{
  width: 30%;
  height: auto!important;
}
.logo-top {
  position: absolute;
  top: 10px;
  left: 14%;
  transform: translateX(-50%);
}

.larger-logo {
  width: 100%;
  margin: auto;
}
</style>
