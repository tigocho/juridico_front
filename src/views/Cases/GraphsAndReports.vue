<template>
  <b-container fluid>
    <b-row v-if="loading">
      <b-col class="py-5" lg="12">
        <b-progress :max="max" height="2rem">
          <b-progress-bar
            :progress_total="progress_total"
            variant="success"
            :style="{ width: progress_total + '%' }"
          >
            <span
              ><b>{{ progress_total }}%</b></span
            >
          </b-progress-bar>
        </b-progress>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col lg="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Porcentaje de Cumplimento de los Casos</h4>
                   <h6>Selecione un periodo de tiempo</h6>
                </template>
                <template v-slot:body>
                  <GraficaCumplimiento
                    element="GraficasCumplimiento"
                    :actividades="actividadesOptions"
                    :actividad_id="0"
                    :clinicasUser="clinicasUser"
                  />
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Cantidades Totales de ANS</h4>
               </template>
                <template v-slot:body>
                  <GraficoTotalSubactividad
                    element="GraficasTotalSubactividad"
                    :actividades="actividadesOptions"
                    :actividad_id="3"
                    :clinicasUser="clinicasUser"
                  />
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Oportunidad de días</h4>
               </template>
                <template v-slot:body>
                  <GraficoOportunidadDias
                    element="GraficoOportunidadDias"
                    :actividades="actividadesOptions"
                    :actividad_id="4"
                    :clinicasUser="clinicasUser"
                  />
                  </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Distribucion de Servicios Juridicos</h4>
               </template>
                <template v-slot:body>
                  <DistribucionServicios
                    element="GraficoDistribucionServicios"
                    :clinicasUser="clinicasUser"
                  />
                  </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <iq-card>
                 <template v-slot:headerTitle>
                  <h4>Tabla de Procentaje de Cumplimento de Casos por Clínica</h4>
                </template>
                <template v-slot:body>
                  <CumplimientoTabla
                  :actividades="actividadesOptions"
                    :actividad_id="0"
                    :clinicasUser="clinicasUser"
                  />
                </template>
                </iq-card>
            </b-col>
            </b-row>
            <b-row>
             <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Casos por Abogado</h4>
                  <h6>Total de casos asignados {{ totalAbogado }}</h6>
                  <b-form-select
                    plain
                    v-model="selectedAbogado"
                    :options="optionsFechas"
                    @input="filtroCasosAbogado"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled
                        >-- Selecione un filtro --</b-form-select-option
                      >
                    </template>
                  </b-form-select>
                </template>
                <template v-slot:body>
                  <CasosPorAbogado
                    v-if="loadAbogado"
                    element="GraficasPorAbogado"
                    :casosAbogado="casosAbogado"
                  />
                  <div class="text-center" v-else>
                    <b-spinner
                      style="width: 3rem; height: 3rem"
                      variant="primary"
                      type="grow"
                      label="Spinning"
                    ></b-spinner>
                  </div>
                </template>
              </iq-card>
            </b-col>
           </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Casos por Clinica</h4>
                  <h6>Total de Casos {{ totalClinica }}</h6>
                  <b-form-select
                    plain
                    v-model="selectedClinica"
                    :options="optionsFechas"
                    @input="filtroCasosClinicas"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled
                        >-- Selecione un filtro --</b-form-select-option
                      >
                    </template>
                  </b-form-select>
                </template>
                <template v-slot:body>
                  <CasosPorClinicas
                    v-if="loadClinica"
                    element="GraficasPorClinicas"
                    :casosClinicas="casosClinicas"
                  />
                  <div class="text-center" v-else>
                    <b-spinner
                      style="width: 3rem; height: 3rem"
                      variant="primary"
                      type="grow"
                      label="Spinning"
                    ></b-spinner>
                  </div>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Casos por Servicio</h4>
                  <h6>Total de Casos {{ totalSubactividades }}</h6>
                  <b-form-select
                    plain
                    v-model="selectedSubactividad"
                    :options="optionsFechas"
                    @input="filtroCasosSubactividades"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled
                        >-- Selecione un filtro --</b-form-select-option
                      >
                    </template>
                  </b-form-select>
                </template>
                <template v-slot:body>
                  <CasosPorSubactividad
                    v-if="loadSubactividad"
                    element="GraficasPorSubactividad"
                    :casosSubactividad="casosSubactividad"
                  />
                  <div class="text-center" v-else>
                    <b-spinner
                      style="width: 3rem; height: 3rem"
                      variant="primary"
                      type="grow"
                      label="Spinning"
                    ></b-spinner>
                  </div>
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
import GraficaCumplimiento from './components/CumplimientoCasos.vue'
import CasosPorAbogado from './components/CasosPorAbogado.vue'
import CasosPorClinicas from './components/CasosPorClinilca.vue'
import CasosPorSubactividad from './components/CasosPorSubactividad.vue'
import CumplimientoTabla from './components/CumplimientoTabla.vue'
import GraficoTotalSubactividad from './components/GraficoTotalSubactividad.vue'
import GraficoOportunidadDias from './components/OportunidadDias.vue'
import DistribucionServicios from './components/DistribucionServicios.vue'
import Vue from 'vue'
import axios from 'axios'
import auth from '@/logic/auth'
export default {
  name: 'GraphsAndReports',
  components: {
    CasosPorAbogado,
    CasosPorClinicas,
    CasosPorSubactividad,
    GraficaCumplimiento,
    CumplimientoTabla,
    GraficoTotalSubactividad,
    GraficoOportunidadDias,
    DistribucionServicios
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    xray.index()
    this.barraCargando()
    this.obtenerCasosPorAbogado()
    this.obtenerCasosPorClinica()
    this.obtenerCasosPorSubactividad()
    this.getActividades()
    this.getUserClinicas()
  },
  data: function () {
    return {
      progress_total: 4,
      max: 100,
      loading: true,
      casosAbogado: [],
      casosClinicas: [],
      casosSubactividad: [],
      selectedAbogado: null,
      loadAbogado: true,
      selectedClinica: null,
      loadClinica: true,
      selectedSubactividad: null,
      loadSubactividad: true,
      intentos: 0,
      errors: {},
      optionsFechas: [
        { value: '1', text: 'Últimos 15 dias' },
        { value: '2', text: 'Mes Actual' },
        { value: '3', text: 'Últimos 6 meses' },
        { value: '4', text: 'Año Actual' }
      ],
      totalAbogado: '',
      totalClinica: '',
      totalSubactividades: '',
      actividad_id: '',
      actividadesOptions: [],
      subactividadesOptions: [],
      clinicasUser: []
    }
  },
  methods: {
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) {
          vm.loading = false
          clearInterval(timer)
        }
      }, 100)
    },
    obtenerCasosPorAbogado () {
      axios
        .post('/casos-abogado')
        .then((res) => {
          if (res.status === 200) {
            this.casosAbogado = res.data.casos
            this.totalAbogado = res.data.total
            this.intentos = 0
            this.errors = {}
          }
        })
        .catch((err) => {
          this.errors = err
          if (this.intentos < 2) {
            this.obtenerCasosPorAbogado()
            this.intentos++
          }
        })
    },
    obtenerCasosPorClinica () {
      axios
        .post('/casos-clinicas')
        .then((res) => {
          if (res.status === 200) {
            this.casosClinicas = res.data.casos
            this.totalClinica = res.data.total
            this.intentos = 0
            this.errors = {}
          }
        })
        .catch((err) => {
          this.errors = err
          if (this.intentos < 2) {
            this.obtenerCasosPorClinica()
            this.intentos++
          }
        })
    },
    obtenerCasosPorSubactividad () {
      axios
        .post('/casos-subactividad')
        .then((res) => {
          if (res.status === 200) {
            this.casosSubactividad = res.data.casos
            this.totalSubactividades = res.data.total
            this.intentos = 0
            this.errors = {}
          }
        })
        .catch((err) => {
          this.errors = err
          if (this.intentos < 2) {
            this.obtenerCasosPorSubactividad()
            this.intentos++
          }
        })
    },
    filtroCasosAbogado () {
      this.loadAbogado = false
      const data = { filtro: this.selectedAbogado }
      axios.post('/casos-abogado', data).then((res) => {
        if (res.status === 200) {
          this.casosAbogado = res.data.casos
          this.totalAbogado = res.data.total
          this.loadAbogado = true
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
    },
    filtroCasosClinicas () {
      this.loadClinica = false
      const data = { filtro: this.selectedClinica }
      axios.post('/casos-clinicas', data).then((res) => {
        if (res.status === 200) {
          this.casosClinicas = res.data.casos
          this.totalClinica = res.data.total
          this.loadClinica = true
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
    },
    filtroCasosSubactividades () {
      this.loadSubactividad = false
      const data = { filtro: this.selectedSubactividad }
      axios.post('/casos-subactividad', data).then((res) => {
        if (res.status === 200) {
          this.casosSubactividad = res.data.casos
          this.totalSubactividades = res.data.total
          this.loadSubactividad = true
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
    },
    getActividades () {
      axios.get('/actividades/fetch').then((response) => {
        this.actividadesOptions = response.data.actividades
        this.actividadesOptions.push({ code: 0, label: 'Todas' })
        this.subactividadesOptions.push({ code: '0', label: 'Todas' })
      })
    },
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.status === 200) {
          this.clinicasUser = res.data.clinicas
          this.clinicasUser.push({ code: '0', label: 'Todas' })
        } else {
          Vue.swal(res.data.message)
        }
      })
    }
  }
}
</script>

<style>
.iq-card-body {
  flex: unset;
}
</style>
