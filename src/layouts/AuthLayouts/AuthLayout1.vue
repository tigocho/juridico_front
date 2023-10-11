<template>
  <div>
    <Loader />
    <section class="sign-in-page">
      <b-container class="sign-in-page-bg mt-5 p-0">
        <div class="row no-gutters">
          <div class="col-md-6 text-center position-relative">
            <!-- Colocando el logo "g-ocho por tu bien" en el recuadro rojo -->
            <div class="logo-top">
              <a class="sign-in-logo" href="#"><img :src="logo" class="img-fluid logo-gocho" alt="logo"></a>
            </div>
            <!-- Fin -->
            <div class="sign-in-detail text-white">
              <!-- Incrementando el tamaño y dándole más protagonismo al logo grande -->
              <Slick :option="slickOptions">
                <div class="item">
                  <img :src="require('../../assets/images/login/juridico-logo.png')" class="img-fluid larger-logo" alt="logo">
                  <p>Crea tus litigios de manera fácil y digitaliza la información. Siempre disponible.</p>
                </div>
              </Slick>
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
  height: 30%!important;
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
