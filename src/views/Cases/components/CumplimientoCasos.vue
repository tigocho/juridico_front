<template>
  <div>
    <b-row>
        <b-col lg="2">
            <b-form-input id="fechaInicio" v-model="fechaInicio" type="date" ></b-form-input>
        </b-col>
         <b-col lg="2">
            <b-form-input id="fechaFin" v-model="fechaFin" type="date" ></b-form-input>
        </b-col>
         <b-col sm="4" md="4" class="my-1">
                <b-form-group
                  label="Clinica"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="2"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="selectedClinica"
                    :options="clinicasUser"
                    :reduce="(label) => label.code"
                    label="label"
                    id="clinica_select"
                  >
                    <span slot="no-options">No hay Clinicas.</span>
                  </v-select>
                </b-form-group>
              </b-col>
    </b-row>
    <b-row style="margin-top:10px;">
         <b-col sm="4" md="4" class="my-1">
                <b-form-group
                  label="Actividad"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="actividad_id"
                    :options="actividades"
                    :reduce="(label) => label.code"
                    label="label"
                    id="clinica_select"
                    @input="getSubactividades"
                  >
                    <span slot="no-options">No hay Actividades.</span>
                  </v-select>
                </b-form-group>
              </b-col>
               <b-col sm="4" md="4" class="my-1">
                <b-form-group
                  label="Subactividad"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="4"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="subactividad_id"
                    :options="subactividadesOptions"
                    :reduce="(label) => label.code"
                    label="label"
                    id="clinica_select"
                  >
                    <span slot="no-options">No hay Subactividades.</span>
                  </v-select>
                </b-form-group>
              </b-col>
              <b-col lg="2">
            <b-button variant="primary"  @click="getCumplimentoCasos">Filtrar</b-button>
        </b-col>
    </b-row>
    <b-alert v-model="showSubactividadAlert" variant="danger" >
      ¡¡Error!! No seleccionaste una Subactividad
    </b-alert>
     <div v-if="loadingGraph" class="text-center">
      <b-spinner variant="primary" type="grow" label="Loading..."></b-spinner>
    </div>
    <div  :id="element"></div>
  </div>
</template>
<script>
import ApexCharts from 'apexcharts'
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import auth from '@/logic/auth'
export default {
  name: 'GraficaCumplimiento',
  props: {
    element: String,
    actividades: Array,
    actividad_id: Number,
    clinicasUser: Array
  },
  data () {
    return {
      loadingGraph: true,
      fechaInicio: moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD'),
      fechaFin: moment(new Date()).format('YYYY-MM-DD'),
      cumplimientos: [],
      meses: [],
      clinicasOptions: [],
      selectedClinica: '0',
      actividadesOptions: [],
      subactividadesOptions: [],
      subactividad_id: '0',
      chart: null,
      showSubactividadAlert: false,
      chartOptions: {
        series: [
          {
            name: 'Cumplimiento de Casos',
            data: []
          },
          {
            name: 'Meta',
            data: []
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 5],
          curve: 'straight',
          dashArray: [0, 8]
        },
        legend: {
          tooltipHoverFormatter: function (val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '%'
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Porcentaje de Cumplimiento (%)'
          }
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val, opts) {
                  return val + ' %'
                }
              }
            },
            {
              title: {
                formatter: function (val, opts) {
                  return val + ' %'
                }
              }
            }
          ]
        },
        grid: {
          borderColor: '#f1f1f1'
        }
      }
    }
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    },
    chartData: function () {
      return this.data
    }
  },
  mounted () {
    this.getCumplimentoCasos()
  },
  methods: {
    crearGrafico () {
      const selector = '#' + this.element
      const totales = []

      for (let i = 0; i < this.cumplimientos.length; i++) {
        totales.push(100)
      }

      this.chartOptions.xaxis.categories = this.graficoMeses
      this.chartOptions.series[0].data = this.cumplimientos
      this.chartOptions.series[1].data = totales

      this.chart = new ApexCharts(
        document.querySelector(selector),
        this.chartOptions
      )
      this.chart.render()
    },
    getCumplimentoCasos () {
      this.loadingGraph = true
      if (this.actividad_id !== 0 && this.subactividad_id === null) {
        this.showSubactividadAlert = true
        this.loadingGraph = false
      } else {
        this.showSubactividadAlert = false
        const dataCasos = {
          fecha_inicio: this.fechaInicio,
          fecha_fin: this.fechaFin,
          clinica_id: this.selectedClinica,
          subactividad_id: this.subactividad_id
        }

        axios.post('/casos-cumplimiento', dataCasos).then((res) => {
          if (res.status === 200) {
            this.loadingGraph = false
            this.graficoMeses = res.data.meses
            this.cumplimientos = res.data.cumplimientos
            if (this.chart != null && this.chart !== undefined) {
              this.updateGrafico()
            } else {
              this.crearGrafico()
            }
            this.subactividadesOptions.push({ code: '0', label: 'Todas' })
          } else {
            Vue.swal('Ocurrió un error tratando de obtener los datos')
          }
        })
      }
    },
    getSubactividades () {
      this.subactividad_id = null
      if (this.actividad_id !== 0) {
        axios
          .get('/subactividades/fetch/' + this.actividad_id)
          .then((response) => {
            this.subactividadesOptions = response.data.subactividades
          })
      } else {
        this.subactividadesOptions = []
      }
    },
    updateGrafico () {
      const totales = []

      for (let i = 0; i < this.cumplimientos.length; i++) {
        totales.push(100)
      }
      this.chart.updateOptions({
        xaxis: {
          categories: this.graficoMeses
        },
        series: [{
          data: this.cumplimientos
        },
        {
          data: totales
        }]
      })
    }
  }
}
</script>
