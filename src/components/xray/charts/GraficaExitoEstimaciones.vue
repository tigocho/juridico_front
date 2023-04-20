<template>
  <iq-card :key="nivelExitoEstimacionesKey">
    <template v-slot:headerTitle>
      <h4>Nivel de éxito (sobre estimaciones)</h4>
    </template>
    <template v-slot:body v-if="procesosNivelExito.length > 0">
      <AmChart element='exito-estimaciones' :height="heightGrafica" :type="GraficaExitoEstimaciones.type" :option="GraficaExitoEstimaciones.bodyData"/>
    </template>
  </iq-card>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'

export default {
  name: 'GraficaExitoEstimaciones',
  props: ['element', 'clinicasIds', 'tipoProceso'],
  mounted () {
    this.obtenerDatosNivelExito()
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
      procesosNivelExito: [],
      nivelExitoEstimacionesKey: 0,
      heightGrafica: 150,
      intentos: 0,
      errores: {},
      GraficaExitoEstimaciones: {
        title: 'Nivel de éxito sobre estimaciones',
        type: 'pie',
        bodyData: {
          colors: ['#05a29d', '#e64141'],
          value: ['porcentajes'],
          category: ['resultado'],
          data: [
            {
              resultado: 'Pretensiones Totales',
              porcentajes: 0
            },
            {
              resultado: 'Pagado clínica',
              porcentajes: 0
            }
            // {
            //   resultado: 'A Favor',
            //   porcentajes: 0
            // },
            // {
            //   resultado: 'En Contra',
            //   porcentajes: 0
            // }
          ]
        }
      }
    }
  },
  methods: {
    obtenerDatosNivelExito () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        let _this = this
        let clinicasConsulta = null
        let tipoProcesoConsulta = null
        if (_this.clinicasIds != null && _this.clinicasIds !== undefined) {
          clinicasConsulta = _this.clinicasIds
        }
        if (_this.tipoProceso != null && _this.tipoProceso !== undefined) {
          tipoProcesoConsulta = _this.tipoProceso
        }
        axios.get('/process/obtener-datos-nivel-exito/' + this.userLogged.usr_id + '/' + clinicasConsulta + '/' + tipoProcesoConsulta).then(res => {
          if (res.data.status_code === 200) {
            this.intentos = 0
            this.errores = {}
            this.procesosNivelExito = res.data.process
            // this.GraficaExitoEstimaciones.bodyData.data[0].porcentajes = this.nivelExitoformulaEstimacionesTotal()
            // this.GraficaExitoEstimaciones.bodyData.data[1].porcentajes = this.nivelExitoformulaEstimacionesPagadoClinica()
            let pagadoClinica = ((this.nivelExitoformulaEstimacionesPagadoClinica() / this.nivelExitoformulaEstimacionesTotal()) * 100)
            let pretensiones = 100 - pagadoClinica
            this.GraficaExitoEstimaciones.bodyData.data[0].porcentajes = pretensiones
            this.GraficaExitoEstimaciones.bodyData.data[1].porcentajes = pagadoClinica
            // this.GraficaExitoEstimaciones.bodyData.data[0].porcentajes = this.nivelExitoformulaEstimacionesAFavor()
            // this.GraficaExitoEstimaciones.bodyData.data[1].porcentajes = this.nivelExitoformulaEstimacionesEnContra()
            this.nivelExitoEstimacionesKey++
          } else {
            Vue.swal('Ocurrió un error tratando de obtener los datos')
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.obtenerDatosNivelExito()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    nivelExitoformulaEstimacionesTotal () {
      if (this.procesosNivelExito != null) {
        return (parseInt(this.procesosNivelExito[7].total_estimaciones))
      } else {
        return 0
      }
    },
    nivelExitoformulaEstimacionesPagadoClinica () {
      if (this.procesosNivelExito != null) {
        return (parseInt(this.procesosNivelExito[7].total_pagado_clinica))
      } else {
        return 0
      }
    },
    nivelExitoformulaEstimacionesAFavor () {
      if (this.procesosNivelExito != null) {
        let totalEstimaciones = this.procesosNivelExito[2].total_estimaciones
        let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        return (parseInt(totalEstimaciones - totalPagadoClinica) / parseInt(totalEstimaciones) * 100).toFixed(1)
      } else {
        return 0
      }
    },
    nivelExitoformulaEstimacionesEnContra () {
      return parseFloat(100 - this.nivelExitoformulaEstimacionesAFavor()).toFixed(1)
    }
  }
}
</script>
