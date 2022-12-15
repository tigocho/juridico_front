<template>
  <iq-card :key="informacionPorRiesgoKey">
    <b-row class="text-center">
      <b-col class="col-4">
        <i class='fa fa-circle' style='color: #05a29d;'></i><p>Posibles: <br> {{ formatoEnMillones(formatPrice(procesosPorRiesgo[3])) }}</p>
      </b-col>
      <b-col class="col-4">
        <i class='fa fa-circle' style='color: #e64141;'></i><p>Probables: <br> {{ formatoEnMillones(formatPrice(procesosPorRiesgo[4])) }}</p>
      </b-col>
      <b-col class="col-4">
        <i class='fa fa-circle' style='color: #FFE633;'></i><p>Remotos: <br>  {{ formatoEnMillones(formatPrice(procesosPorRiesgo[5])) }}</p>
      </b-col>
    </b-row>
    <template v-slot:headerTitle>
      <h4>Información por riesgo</h4>
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
  props: ['clinicasIds', 'tipoProceso'],
  mounted () {
    this.obtenerDatosGraficaInformacionPorRiesgo()
  },
  computed: {
    userLogged () {
      if (auth.getUserLogged() !== undefined) {
        return JSON.parse(auth.getUserLogged())
      } else {
        return null
      }
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
          colors: ['#05a29d', '#e64141', '#FFE633'],
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
        let _this = this
        let clinicasConsulta = null
        if (_this.clinicasIds != null && _this.clinicasIds !== undefined) {
          clinicasConsulta = _this.clinicasIds
        }
        axios
          .get('/process/obtenerProcesosPorRiesgo/' + this.userLogged.usr_id + '/' + clinicasConsulta + '/' + this.tipoProceso)
          .then(res => {
            if (res.data.status_code === 200) {
              this.intentos = 0
              this.procesosPorRiesgo = res.data.procesos
              this.GraficaInformacionPorRiesgo.bodyData.data[0].porcentajes = this.procesosPorRiesgo[0].toFixed(
                1
              )
              this.GraficaInformacionPorRiesgo.bodyData.data[1].porcentajes = this.procesosPorRiesgo[1].toFixed(
                1
              )
              this.GraficaInformacionPorRiesgo.bodyData.data[2].porcentajes = this.procesosPorRiesgo[2].toFixed(
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
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatoEnMillones (value) {
      let val = value.toString()
      val = val.slice(0, -4) + ' mill.'
      return val
    }
  }
}
</script>
