<template>
  <iq-card :key="informacionPorRiesgoKey">
    <template v-slot:headerTitle>
      <h4>Informacion por riesgo</h4>
    </template>
    <template v-slot:body v-if="procesosPorRiesgo.length > 0">
      <AmChart
        element="informacion-por-riesgo"
        :height="heightGrafica"
        :type="GraficaInformacionPorRiesgo.type"
        :option="GraficaInformacionPorRiesgo.bodyData"
      />
    </template>
  </iq-card>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'

export default {
  name: 'GraficaInformacionPorRiesgo',
  mounted () {
    this.obtenerDatosGraficaInformacionPorRiesgo()
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  data () {
    return {
      procesosPorRiesgo: [],
      informacionPorRiesgoKey: 0,
      heightGrafica: 250,
      GraficaInformacionPorRiesgo: {
        title: 'Informacion por riesgo',
        type: 'pie',
        bodyData: {
          colors: ['#47A9A1', '#B8B8B7', '#FFE633'],
          value: ['porcentajes'],
          category: ['resultado'],
          data: [
            {
              resultado: 'Posible',
              porcentajes: 0
            },
            {
              resultado: 'Probables',
              porcentajes: 0
            },
            {
              resultado: 'Remotos',
              porcentajes: 0
            }
          ]
        }
      }
    }
  },
  methods: {
    obtenerDatosGraficaInformacionPorRiesgo () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios
          .get('/process/obtenerProcesosPorRiesgo/' + this.userLogged.usr_id)
          .then(res => {
            if (res.data.status_code === 200) {
              this.intentos = 0
              this.procesosPorRiesgo = res.data.procesos
              this.GraficaInformacionPorRiesgo.bodyData.data[0].porcentajes = res.data.procesos[0].toFixed(
                1
              )
              this.GraficaInformacionPorRiesgo.bodyData.data[1].porcentajes = res.data.procesos[1].toFixed(
                1
              )
              this.GraficaInformacionPorRiesgo.bodyData.data[2].porcentajes = res.data.procesos[2].toFixed(
                1
              )
              this.informacionPorRiesgoKey++
            } else {
              Vue.swal('Ocurrió un error tratando de obtener los datos')
            }
          })
          .catch(err => {
            this.errores = err
            if (this.intentos < 2) {
              this.obtenerDatosGraficaInformacionPorRiesgo()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    }
  }
}
</script>
