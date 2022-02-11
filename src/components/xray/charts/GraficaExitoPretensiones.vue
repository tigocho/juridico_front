<template>
  <iq-card :key='nivelExitoPretensionesKey'>
    <template v-slot:headerTitle>
      <h4>Nivel de éxito (sobre pretensiones)</h4>
    </template>
    <template v-slot:body v-if='procesosNivelExito.length > 0'>
      <AmChart
        element="exito-pretensiones"
        :height='heightGrafica'
        :type='GraficaExitoPretensiones.type'
        :option='GraficaExitoPretensiones.bodyData'
      />
    </template>
  </iq-card>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'

export default {
  name: 'GraficaExitoPretensiones',
  props: ['clinicasIds'],
  mounted () {
    this.obtenerDatosNivelExito()
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  data () {
    return {
      procesosNivelExito: [],
      nivelExitoPretensionesKey: 0,
      heightGrafica: 250,
      intentos: 0,
      errores: {},
      GraficaExitoPretensiones: {
        title: 'Nivel de éxito sobre pretensiones',
        type: 'pie',
        bodyData: {
          colors: ['#05a29d', '#e64141'],
          value: ['porcentajes'],
          category: ['resultado'],
          data: [
            {
              resultado: 'A Favor',
              porcentajes: 0
            },
            {
              resultado: 'En Contra',
              porcentajes: 0
            }
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
        if (_this.clinicasIds != null && _this.clinicasIds !== undefined) {
          clinicasConsulta = _this.clinicasIds
        }
        axios.get('/process/obtener-datos-nivel-exito/' + this.userLogged.usr_id + '/' + clinicasConsulta).then(res => {
          if (res.data.status_code === 200) {
            this.intentos = 0
            this.errores = {}
            this.procesosNivelExito = res.data.process
            this.GraficaExitoPretensiones.bodyData.data[0].porcentajes = this.nivelExitoformulaPretensionesAFavor()
            this.GraficaExitoPretensiones.bodyData.data[1].porcentajes = this.nivelExitoformulaPretensionesEnContra()
            this.nivelExitoPretensionesKey++
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
    nivelExitoformulaPretensionesAFavor () {
      if (this.procesosNivelExito != null) {
        let cuantiaPretensionesTotales = this.procesosNivelExito[2].cuantia_pretensiones
        let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        return (parseInt(cuantiaPretensionesTotales - totalPagadoClinica) / parseInt(cuantiaPretensionesTotales) * 100).toFixed(1)
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesEnContra () {
      return parseFloat(100 - this.nivelExitoformulaPretensionesAFavor()).toFixed(1)
    }
  }
}
</script>
