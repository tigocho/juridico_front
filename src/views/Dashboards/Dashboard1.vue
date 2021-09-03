<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <b-row>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-primary rounded">
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-primary"><i class="ri-user-fill"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ cantidadUsuarios }}</span></h2>
                    <h5 class="">Usuarios</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-warning rounded">
              <template v-slot:body >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-warning"><i class="ri-time-line"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ procesosAbiertos }}</span></h2>
                    <h5 class="">Proc. abiertos</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-success rounded">
              <template v-slot:body >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-success"><i class="ri-checkbox-circle-line"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ procesosCerrados }}</span></h2>
                    <h5 class="">Proc. cerrados</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-info rounded">
              <template v-slot:body >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-info"><i class="ri-government-line"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ audienciasPendientes }}</span></h2>
                    <h5 class="">Audiencias</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Bienvenidos a Juridico App</h4>
          </template>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Ingreso de procesos en los últimos 12 meses</h4>
                </template>
                <template v-slot:body>
                  <MorrisChart :element="ingresoProcesos.type+0" :type="ingresoProcesos.type" :xKeys="ingresoProcesos.xKeys" :data="ingresoProcesos.bodyData" :colors="ingresoProcesos.colors" :yKeys="ingresoProcesos.yKeys" :labels="ingresoProcesos.labels"/>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos activos por clínica</h4>
                </template>
                <template v-slot:body>
                  <GraficaProcesosPorClinica ref='chartClinicas' element="patient"/>
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Nivel de éxito</h4>
                </template>
                <template v-slot:body>
                  <b-table
                    :items="procesosNivelExito"
                    :fields="fields"
                    stacked="md"
                    show-empty
                    small
                    style='overflow: auto'
                  >
                    <template #cell(name)="row">
                      {{ row.value.first }} {{ row.value.last }}
                    </template>
                  </b-table>
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card :key="nivelExitoPretensionesKey">
                <template v-slot:headerTitle>
                  <h4>Nivel de éxito (sobre pretensiones)</h4>
                </template>
                <template v-slot:body v-if="procesosNivelExito.length > 0">
                  <AmChart element='exito-pretensiones' :height="heightGraficas" :type="GraficaExitoPretensiones.type" :option="GraficaExitoPretensiones.bodyData"/>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <iq-card :key="nivelExitoEstimacionesKey">
                <template v-slot:headerTitle>
                  <h4>Nivel de éxito (sobre estimaciones)</h4>
                </template>
                <template v-slot:body v-if="procesosNivelExito.length > 0">
                  <AmChart element='exito-estimaciones' :height="heightGraficas" :type="GraficaExitoEstimaciones.type" :option="GraficaExitoEstimaciones.bodyData"/>
                </template>
              </iq-card>
            </b-col>
          </b-row>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'Dashboard1',
  mounted () {
    xray.index()
    this.obtenerDatosGraficaProcesosMensual()
    this.obtenerNumeroUsuarios()
    setTimeout(() => {
      this.obtenerDatosNivelExito()
      this.obtenerCantidadProcesosAbiertos()
      this.obtenerCantidadProcesosCerrados()
      this.obtenerCantidadAudienciasPendientes()
    }, 500)
  },
  data: function () {
    return {
      cantidadUsuarios: '',
      procesosAbiertos: '',
      procesosCerrados: '',
      audienciasPendientes: '',
      clinicasInforme: [],
      totalesInformePorClinicas: [],
      categoriasClinicas: [],
      heightGraficas: 250,
      ingresoProcesos: {
        type: 'bar',
        bodyData: [],
        xKeys: 'mes',
        yKeys: ['total'],
        colors: [ '#36A2EB' ],
        labels: [ 'Procesos' ]
      },
      intentos: 0,
      errores: {},
      nivelExitoPretensionesKey: 0,
      nivelExitoEstimacionesKey: 0,
      procesosNivelExito: [],
      fields: [
        { key: 'prore_sentencia_final', label: 'Etiqueta', class: 'text-center' },
        {
          key: 'total_pagado_clinica',
          label: 'Total pagado clínica',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        { key: 'afectacion_total', label: 'Total pagado aseguradora(s)', class: 'text-left' },
        {
          key: 'total_pagado_tercero',
          label: 'Total pagado por tecero',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        {
          key: 'total_sentencia',
          label: 'Total sentencia',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        {
          key: 'cuantia_pretensiones',
          label: 'Cuantía de las pretensiones',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        {
          key: 'estimacion_pago_perju_materiales',
          label: 'Suma de estimación perjuicios Mat.',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        {
          key: 'estimacion_pago_perju_inmateriales',
          label: 'Suma de estimación perjuicios Inmat.',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        {
          key: 'total_estimaciones',
          label: 'Total estimaciones',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        }
      ],
      GraficaExitoPretensiones: {
        title: 'Nivel de éxito sobre pretensiones',
        type: 'pie',
        bodyData: {
          colors: ['#47A9A1', '#e64141'],
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
      },
      GraficaExitoEstimaciones: {
        title: 'Nivel de éxito sobre estimaciones',
        type: 'pie',
        bodyData: {
          colors: ['#47A9A1', '#e64141'],
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
    obtenerNumeroUsuarios: function () {
      axios.get('/users/obtenerCantidadUsuarios').then(res => {
        if (res.data.status_code === 200) {
          this.cantidadUsuarios = res.data.cantidad_usuarios
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadProcesosAbiertos: function () {
      axios.get('/process/obtenerCantidadProcesosAbiertos').then(res => {
        if (res.data.status_code === 200) {
          this.procesosAbiertos = res.data.cantidad_procesos_abiertos
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadProcesosCerrados: function () {
      axios.get('/process/obtenerCantidadProcesosCerrados').then(res => {
        if (res.data.status_code === 200) {
          this.procesosCerrados = res.data.cantidad_procesos_cerrados
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadAudienciasPendientes: function () {
      axios.get('/agenda/obtenerCantidadAudienciasPendientes').then(res => {
        if (res.data.status_code === 200) {
          this.audienciasPendientes = res.data.cantidad_audiencias_pendientes
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerDatosGraficaProcesosMensual () {
      axios.get('/process/obtener-datos-grafica-procesos-mensual').then(res => {
        if (res.data.status_code === 200) {
          this.intentos = 0
          this.errores = {}
          let procesosMensual = res.data.process
          this.ingresoProcesos.bodyData = procesosMensual
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.obtenerDatosGraficaProcesosMensual()
            this.intentos++
          }
        })
    },
    obtenerDatosNivelExito () {
      axios.get('/process/obtener-datos-nivel-exito').then(res => {
        if (res.data.status_code === 200) {
          this.intentos = 0
          this.errores = {}
          this.procesosNivelExito = res.data.process
          this.GraficaExitoPretensiones.bodyData.data[0].porcentajes = this.nivelExitoformulaPretensionesAFavor()
          this.GraficaExitoPretensiones.bodyData.data[1].porcentajes = this.nivelExitoformulaPretensionesEnContra()
          this.GraficaExitoEstimaciones.bodyData.data[0].porcentajes = this.nivelExitoformulaEstimacionesAFavor()
          this.GraficaExitoEstimaciones.bodyData.data[1].porcentajes = this.nivelExitoformulaEstimacionesEnContra()
          this.nivelExitoPretensionesKey++
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
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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

<style>
.iq-card-body{
  flex: unset;
}
</style>
