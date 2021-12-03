<template>
  <b-container fluid>
    <b-row v-if="loading">
      <b-col class="py-5" lg="12">
        <b-progress :max="max" height="2rem">
          <b-progress-bar :progress_total="progress_total" variant="success" :style="{width: progress_total + '%'}">
            <span><b>{{ progress_total }}%</b></span>
          </b-progress-bar>
        </b-progress>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col lg="12">
        <b-row>
          <b-col md="6" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="bg-primary rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon iq-bg-primary">
                    <i class="ri-book-2-fill"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter text-white">{{
                        procesosAbiertos + procesosCerrados
                      }}</span>
                    </h2>
                    <h5 class="text-white">Total procesos</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              style="background-color: #47A9A1"
              body-class="rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon" style="background-color:#fff">
                    <i class="ri-check-fill" style="color: #47A9A1"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter text-white">{{
                        procesosAbiertos }}</span>
                    </h2>
                    <h5 class="text-white">Procesos Abiertos</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="bg-danger rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon iq-bg-danger">
                    <i class="ri-book-2-fill"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter text-white">{{
                        procesosCerrados }}</span>
                    </h2>
                    <h5 class="text-white">Procesos cerrados</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" lg="6">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="iq-bg-warning rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-warning">
                    <i class="ri-time-line"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{
                        formatPrice(totalPretensiones)
                      }}</span>
                    </h2>
                    <h5 class="">Total pretensiones</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="6">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="iq-bg-info rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-info">
                    <i class="ri-checkbox-circle-line"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{
                        formatPrice(totalEstimacionesPretensiones)
                      }}</span>
                    </h2>
                    <h5 class="">Total estimación pretensiones</h5>
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
                    <h4>Procesos activos por clínica</h4>
                  </template>
                  <template v-slot:body>
                    <GraficaProcesosPorClinica ref='chartClinicas' element="patient"/>
                  </template>
                </iq-card>
            </b-col>
            <b-col lg="6">
              <GraficaInformacionPorRiesgo element="patient"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <GraficaExitoPretensiones/>
            </b-col>
            <b-col lg="6">
              <GraficaExitoEstimaciones/>
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
import auth from '@/logic/auth'

export default {
  name: 'DashboardGerencia',
  mounted () {
    xray.index()
    this.barraCargando()
    this.obtenerTotalEstimacionesPretensiones()
    this.obtenerTotalPretensiones()
    setTimeout(() => {
      this.obtenerCantidadProcesosAbiertos()
      this.obtenerCantidadProcesosCerrados()
      this.obtenerCantidadAudienciasPendientes()
    }, 800)
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  data: function () {
    return {
      cantidadUsuarios: '',
      procesosAbiertos: '',
      procesosCerrados: '',
      audienciasPendientes: '',
      totalEstimacionesPretensiones: '',
      totalPretensiones: '',
      procesosPosibles: '',
      procesosProbables: '',
      progress_total: 4,
      max: 100,
      loading: true,
      procesosRemostos: '',
      clinicasInforme: [],
      totalesInformePorClinicas: [],
      categoriasClinicas: [],
      intentos: 0,
      errores: {},
      informacionPorRiesgoKey: 0,
      nivelExitoPretensionesKey: 0,
      nivelExitoEstimacionesKey: 0,
      procesosPorRiesgo: [],
      procesosNivelExito: [],
      heightGraficas: 250,
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
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    obtenerTotalEstimacionesPretensiones: function () {
      axios.get('/process/obtenerTotalEstimacionesPretensiones/' + this.userLogged.usr_id).then(res => {
        if (res.data.status_code === 200) {
          this.totalEstimacionesPretensiones = res.data.estimaciones_pretensiones
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerTotalPretensiones: function () {
      axios.get('/process/obtenerTotalPretensiones/' + this.userLogged.usr_id).then(res => {
        if (res.data.status_code === 200) {
          this.totalPretensiones = res.data.pretensiones
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerDatosGraficaInformacionPorRiesgo: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerProcesosPorRiesgo/' + this.userLogged.usr_id).then(res => {
          if (res.data.status_code === 200) {
            this.procesosPorRiesgo = res.data.procesos
            this.GraficaInformacionPorRiesgo.bodyData.data[0].porcentajes = res.data.procesos[0].toFixed(1)
            this.GraficaInformacionPorRiesgo.bodyData.data[1].porcentajes = res.data.procesos[1].toFixed(1)
            this.GraficaInformacionPorRiesgo.bodyData.data[2].porcentajes = res.data.procesos[2].toFixed(1)
            this.informacionPorRiesgoKey++
          } else {
            Vue.swal('Ocurrió un error tratando de obtener los datos')
          }
        })
          .catch((err) => {
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
    obtenerCantidadProcesosAbiertos: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerCantidadProcesosAbiertos/' + this.userLogged.usr_id).then(res => {
          if (res.data.status_code === 200) {
            this.procesosAbiertos = res.data.cantidad_procesos_abiertos
          } else {
            alert('Datos no validos')
          }
        })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    obtenerCantidadProcesosCerrados: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerCantidadProcesosCerrados/' + this.userLogged.usr_id).then(res => {
          if (res.data.status_code === 200) {
            this.procesosCerrados = res.data.cantidad_procesos_cerrados
          } else {
            alert('Datos no validos')
          }
        })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    obtenerCantidadAudienciasPendientes: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/agenda/obtenerCantidadAudienciasPendientes').then(res => {
          if (res.data.status_code === 200) {
            this.audienciasPendientes = res.data.cantidad_audiencias_pendientes
            this.loading = false
          } else {
            alert('Datos no validos')
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
.iq-card-body {
  flex: unset;
}
</style>
