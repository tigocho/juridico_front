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
      <b-col lg="12" :key="graficaValoresPorClinicaKey">
        <b-row>
          <b-col md="6" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="bg-primary rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon iq-bg-primary">
                    <i class="fas fa-gavel"></i>
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
                    <i class="fas fa-folder-open" style="color: #47A9A1"></i>
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
          <b-col md="4" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="iq-bg-warning rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-warning">
                    <i class="fas fa-coins"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{
                        formatoEnMillones(totalPretensiones)
                      }}</span>
                    </h2>
                    <h5 class="">Total pretensiones en millones</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="4" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="iq-bg-info rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-info">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{
                        formatoEnMillones(totalEstimacionesPretensiones)
                      }}</span>
                    </h2>
                    <h5 class="">Total estimación pretensiones en millones</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="4" lg="4">
            <iq-card
              class-name="iq-card-block iq-card-stretch iq-card-height"
              body-class="iq-bg-info rounded"
            >
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-info">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{
                        formatoEnMillones(totalProvisiones)
                      }}</span>
                    </h2>
                    <h5 class="">Total provisiones en millones</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </b-col>
      <b-col lg="12" :key="graficaProcesosPorClinicaKey">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Bienvenidos a Juridico App</h4>
          </template>
          <b-row>
            <b-col lg="6">
              <b-row style="margin-left:2px;">
              <b-col sm="4" md="6"  class="my-1" >
                <b-form-group
                  label="Clínica"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    multiple
                    v-model="clinicasIds"
                    :options="clinicaOptions"
                    @input="cambioClinica()"
                    :reduce="label => label.code"
                    label="label"
                    id="clinica_id"
                    :class="(errors.length > 0 ? ' is-invalid' : '') + 'ml-1' "
                    >
                    <span slot="no-options">No hay clínicas.</span>
                  </v-select>
                </b-form-group>
              </b-col>
              <b-col sm="4" md="6" class="my-1">
                <b-form-group
                  label="Tipo de Proceso"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="tipoProceso"
                    :options="tipoProcesosOptions"
                    @input="cambioClinica()"
                    :reduce="label => label.code"
                    label="label"
                    id="tipo_id"
                    :class="(errors.length > 0 ? ' is-invalid' : '') + 'ml-1' "
                    >
                    <span slot="no-options">No hay clínicas.</span>
                  </v-select>
                </b-form-group>
              </b-col>
            </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos activos por clínica</h4>
                </template>
                <template v-slot:body>
                  <GraficaProcesosPorClinica ref='chartClinicas' :clinicasIds="clinicasIds" element="patient" :tipoProceso="tipoProceso"/>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <GraficaInformacionPorRiesgo element="riesgo" :clinicasIds="clinicasIds" :tipoProceso="tipoProceso"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <GraficaExitoPretensiones :clinicasIds="clinicasIds"
              :tipoProceso="tipoProceso" />
            </b-col>
            <b-col lg="6">
              <GraficaExitoEstimaciones :clinicasIds="clinicasIds"
              :tipoProceso="tipoProceso"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos activos por especialidad</h4>
                </template>
                <template v-slot:body>
                  <GraficaProcesosPorEspecialidad ref='chartEspecialidad' element="especialidad" :clinicasIds="clinicasIds" :tipoProceso="tipoProceso"/>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos por estados</h4>
                </template>
                <template>
                  <GraficaProcesosPorEstados ref='chartEstados' element="estados" :clinicasIds="clinicasIds" :tipoProceso="tipoProceso"/>
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Procesos por aseguradora</h4>
                </template>
                <template v-slot:body>
                  <GraficaProcesosPorAseguradora ref='chartAseguradora' element="aseguradoraa" :clinicasIds="clinicasIds" :tipoProceso="tipoProceso"/>
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <!-- <b-row>
            <b-col lg="6">
              <b-col sm="5" md="7"  class="my-1" >
                <b-form-group
                  label="Clínica"
                  label-cols-sm="3"
                  label-cols-md="3"
                  label-cols-lg="4"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    multiple
                    v-model="clinicasIds"
                    :options="clinicaOptions"
                    :reduce="label => label.code"
                    label="label"
                    @input="cambioFiltro()"
                    id="clinica_id"
                    >
                    <span slot="no-options">No hay clínicas.</span>
                  </v-select>
                </b-form-group>
              </b-col>
            </b-col>
            <b-col lg="6">
              <b-col sm="5" md="7"  class="my-1" >
                <b-form-group
                  label="Tipo de Proceso"
                  label-cols-sm="3"
                  label-cols-md="3"
                  label-cols-lg="4"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="tipoProceso"
                    :options="tipoProcesosOptions"
                    :reduce="label => label.code"
                    label="label"
                    id="tipo_id"
                    @input="cambioFiltro()"
                    >
                    <span slot="no-options">No hay tipos de procesos.</span>
                  </v-select>
                </b-form-group>
              </b-col>
            </b-col>
          </b-row> -->
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
                    style='overflow: auto; border: 3px solid lightgray;'
                  >
                    <template #cell(name)="row">
                      {{ row.value.first }} {{ row.value.last }}
                    </template>
                  </b-table>
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
import auth from '@/logic/auth'

export default {
  name: 'DashboardGerencia',
  mounted () {
    xray.index()
    this.barraCargando()
    this.obtenerTotalEstimacionesPretensiones()
    this.obtenerTotalPretensiones()
    this.obtenerTotalProvisiones()
    this.fetchClinicaOptions()
    setTimeout(() => {
      this.obtenerCantidadProcesosAbiertos()
      this.obtenerCantidadProcesosCerrados()
      this.obtenerDatosNivelExito()
    }, 800)
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
  data: function () {
    return {
      graficaProcesosPorClinicaKey: 0,
      graficaValoresPorClinicaKey: 0,
      errors: [],
      clinicasIds: null,
      clinicaOptions: [],
      tipoProcesosOptions: [{ code: 0, label: 'Todos' }, { code: 1, label: 'Responsabilidad Medica' }, { code: 2, label: 'Laborales' }, { code: 3, label: 'Otros' }],
      tipoProceso: 0,
      procesosAbiertos: '',
      procesosCerrados: '',
      totalEstimacionesPretensiones: '',
      totalPretensiones: '',
      totalProvisiones: '',
      progress_total: 4,
      max: 100,
      loading: true,
      intentos: 0,
      errores: {},
      procesosNivelExito: [],
      fields: [
        {
          key: 'prore_sentencia_final',
          label: 'Clasificación Sentencia',
          class: 'text-center'
        },
        {
          key: 'total_pagado_clinica',
          label: 'Total pagado clínica',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
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
      ]
    }
  },
  methods: {
    fetchClinicaOptions: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/clinicas/obtener-clinicas/' + this.userLogged.usr_id).then(response => {
          this.clinicaOptions = response.data.clinicas
          if (this.clinicaOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
            if (this.clinicaOptions.length === 1) {
              this.clinicaId = this.clinicaOptions[0].code
            } else {
              this.clinicaOptions.push({ code: 0, label: 'Todos' })
              this.clinicasIds = 0
            }
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchClinicaOptions()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    cambioClinica () {
      if (this.clinicasIds.length === 0) {
        this.clinicasIds = 0
      }
      if (this.clinicasIds[0] === 0) {
        this.clinicasIds.shift()
      }
      this.obtenerCantidadProcesosAbiertos()
      this.obtenerCantidadProcesosCerrados()
      setTimeout(() => {
        this.obtenerTotalEstimacionesPretensiones()
        this.obtenerTotalPretensiones()
        this.obtenerTotalProvisiones()
        this.obtenerDatosNivelExito()
        this.graficaProcesosPorClinicaKey++
        this.graficaValoresPorClinicaKey++
      }, 800)
    },
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    obtenerTotalEstimacionesPretensiones: function () {
      axios.get('/process/obtenerTotalEstimacionesPretensiones/' + this.userLogged.usr_id + '/' + this.clinicasIds + '/' + this.tipoProceso).then(res => {
        if (res.data.status_code === 200) {
          this.totalEstimacionesPretensiones = res.data.estimaciones_pretensiones
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerTotalPretensiones: function () {
      axios.get('/process/obtenerTotalPretensiones/' + this.userLogged.usr_id + '/' + this.clinicasIds + '/' + this.tipoProceso).then(res => {
        if (res.data.status_code === 200) {
          this.totalPretensiones = res.data.pretensiones
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerTotalProvisiones: function () {
      axios.get('/process/obtenerTotalProvisiones/' + this.userLogged.usr_id + '/' + this.clinicasIds + '/' + this.tipoProceso).then(res => {
        if (res.data.status_code === 200) {
          this.totalProvisiones = res.data.provisiones
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadProcesosAbiertos: function () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerCantidadProcesosAbiertos/' + this.userLogged.usr_id + '/' + this.clinicasIds + '/' + this.tipoProceso).then(res => {
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
        axios.get('/process/obtenerCantidadProcesosCerrados/' + this.userLogged.usr_id + '/' + this.clinicasIds + '/' + this.tipoProceso).then(res => {
          if (res.data.status_code === 200) {
            this.procesosCerrados = res.data.cantidad_procesos_cerrados
            this.loading = false
          } else {
            alert('Datos no validos')
          }
        })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    obtenerDatosNivelExito () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtener-datos-nivel-exito/' + this.userLogged.usr_id + '/' + this.clinicasIds + '/' + this.tipoProceso).then(res => {
          if (res.data.status_code === 200) {
            this.intentos = 0
            this.errores = {}
            if (typeof res.data.process === 'undefined') {
              Vue.swal(res.data.mensaje)
            } else {
              this.procesosNivelExito = res.data.process
            }
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
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      if (value === 0) {
        return '$0'
      }
      return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatoEnMillones (value) {
      let val = value.toString()
      val = val.slice(0, -6)
      return this.formatPrice(val)
    }
  }
}
</script>

<style>
.iq-card-body {
  flex: unset;
}
</style>
