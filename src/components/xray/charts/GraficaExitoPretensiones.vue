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
      nivelExitoPretensionesKey: 0,
      heightGrafica: 150,
      intentos: 0,
      errores: {},
      GraficaExitoPretensiones: {
        title: 'Nivel de éxito sobre pretensiones',
        type: 'pie',
        oversizedBehavior: 'wrap',
        bodyData: {
          truncate: true,
          colors: ['#05a29d', '#e64141'],
          value: ['porcentajes'],
          category: ['resultado'],
          data: [
            {
              resultado: 'Estimaciones Totales',
              porcentajes: 0
            },
            // {
            //   resultado: 'En Contra',
            //   porcentajes: 0
            // },
            // {
            //   resultado: 'Desistimiendo',
            //   porcentajes: 0
            // },
            // {
            //   resultado: 'Rechazado',
            //   porcentajes: 0
            // },
            // {
            //   resultado: 'Conciliado',
            //   porcentajes: 0
            // },
            {
              resultado: 'Pagado clínica',
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
            console.log(this.procesosNivelExito[7].total_pagado_clinica)
            console.log(this.procesosNivelExito[7].cuantia_pretensiones)
            let pagadoClinica = ((this.nivelExitoformulaPretensionesTotalPagadoClinica() / this.nivelExitoformulaPretensionesTotal()) * 100)
            let pretensiones = 100 - pagadoClinica
            // this.GraficaExitoPretensiones.bodyData.data[0].porcentajes = this.nivelExitoformulaPretensionesTotal()
            // this.GraficaExitoPretensiones.bodyData.data[1].porcentajes = this.nivelExitoformulaPretensionesTotalPagadoClinica()
            this.GraficaExitoPretensiones.bodyData.data[0].porcentajes = pretensiones
            this.GraficaExitoPretensiones.bodyData.data[1].porcentajes = pagadoClinica
            // this.GraficaExitoPretensiones.bodyData.data[0].porcentajes = this.nivelExitoformulaPretensionesAFavor()
            // this.GraficaExitoPretensiones.bodyData.data[1].porcentajes = this.nivelExitoformulaPretensionesEnContra()
            // this.GraficaExitoPretensiones.bodyData.data[2].porcentajes = this.nivelExitoformulaPretensionesDesistimiento()
            // this.GraficaExitoPretensiones.bodyData.data[3].porcentajes = this.nivelExitoformulaPretensionesRechazado()
            // this.GraficaExitoPretensiones.bodyData.data[4].porcentajes = this.nivelExitoformulaPretensionesConciliado()
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
    nivelExitoformulaPretensionesTotalPagadoClinica () {
      if (this.procesosNivelExito != null) {
        return (parseInt(this.procesosNivelExito[7].total_pagado_clinica))
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesTotal () {
      if (this.procesosNivelExito != null) {
        return (parseInt(this.procesosNivelExito[7].cuantia_pretensiones))
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesAFavor () {
      if (this.procesosNivelExito != null) {
        return 1 - (parseInt(this.procesosNivelExito[0].total_pagado_clinica) / parseInt(this.procesosNivelExito[0].cuantia_pretensiones))
        // console.log(this.procesosNivelExito)
        // let cuantiaPretensionesTotales = this.procesosNivelExito[5].cuantia_pretensiones
        // let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        // return (parseInt(cuantiaPretensionesTotales - totalPagadoClinica) / parseInt(cuantiaPretensionesTotales) * 100).toFixed(1)
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesEnContra () {
      if (this.procesosNivelExito != null) {
        return 1 - (parseInt(this.procesosNivelExito[1].total_pagado_clinica) / parseInt(this.procesosNivelExito[1].total_pagado_clinica))
        //   let cuantiaPretensionesTotales = this.procesosNivelExito[2].cuantia_pretensiones
        //   let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        //   return (parseInt(cuantiaPretensionesTotales - totalPagadoClinica) / parseInt(cuantiaPretensionesTotales) * 100).toFixed(1)
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesDesistimiento () {
      if (this.procesosNivelExito != null) {
        return 1 - (parseInt(this.procesosNivelExito[2].total_pagado_clinica) / parseInt(this.procesosNivelExito[2].cuantia_pretensiones))
        //   let cuantiaPretensionesTotales = this.procesosNivelExito[2].cuantia_pretensiones
        //   let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        //   return (parseInt(cuantiaPretensionesTotales - totalPagadoClinica) / parseInt(cuantiaPretensionesTotales) * 100).toFixed(1)
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesRechazado () {
      if (this.procesosNivelExito != null) {
        return 1 - (parseInt(this.procesosNivelExito[3].total_pagado_clinica) / parseInt(this.procesosNivelExito[3].cuantia_pretensiones))
        //   let cuantiaPretensionesTotales = this.procesosNivelExito[2].cuantia_pretensiones
        //   let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        //   return (parseInt(cuantiaPretensionesTotales - totalPagadoClinica) / parseInt(cuantiaPretensionesTotales) * 100).toFixed(1)
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesConciliado () {
      if (this.procesosNivelExito != null) {
        return 1 - (parseInt(this.procesosNivelExito[4].total_pagado_clinica) / parseInt(this.procesosNivelExito[4].cuantia_pretensiones))
        //   let cuantiaPretensionesTotales = this.procesosNivelExito[2].cuantia_pretensiones
        //   let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        //   return (parseInt(cuantiaPretensionesTotales - totalPagadoClinica) / parseInt(cuantiaPretensionesTotales) * 100).toFixed(1)
      } else {
        return 0
      }
    },
    nivelExitoformulaPretensionesSinAsignar () {
      if (this.procesosNivelExito != null) {
        return 1 - (parseInt(this.procesosNivelExito[4].total_pagado_clinica) / parseInt(this.procesosNivelExito[4].cuantia_pretensiones))
        //   let cuantiaPretensionesTotales = this.procesosNivelExito[2].cuantia_pretensiones
        //   let totalPagadoClinica = this.procesosNivelExito[1].total_pagado_clinica
        //   return (parseInt(cuantiaPretensionesTotales - totalPagadoClinica) / parseInt(cuantiaPretensionesTotales) * 100).toFixed(1)
      } else {
        return 0
      }
    }
    // nivelExitoformulaPretensionesEnContra () {
    //   return parseFloat(100 - this.nivelExitoformulaPretensionesAFavor()).toFixed(1)
    // }
  }
}
</script>
