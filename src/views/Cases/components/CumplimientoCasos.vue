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
                    :options="clinicasOptions"
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
                    :options="actividadesOptions"
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
    element: String
  },
  data () {
    return {
      fechaInicio: moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD'),
      fechaFin: moment(new Date()).format('YYYY-MM-DD'),
      cumplimientos: [],
      meses: [],
      clinicasOptions: [],
      selectedClinica: '0',
      actividad_id: '0',
      actividadesOptions: [],
      subactividadesOptions: [],
      subactividad_id: '0',
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
    }
  },
  mounted () {
    this.getUserClinicas()
    this.getCumplimentoCasos()
    this.getActividades()
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

      const chart = new ApexCharts(
        document.querySelector(selector),
        this.chartOptions
      )

      chart.render()
    },
    getCumplimentoCasos () {
      const dataCasos = {
        fecha_inicio: this.fechaInicio,
        fecha_fin: this.fechaFin,
        clinica_id: this.selectedClinica,
        subactividad_id: this.subactividad_id
      }

      axios.post('/casos-cumplimiento', dataCasos).then((res) => {
        if (res.status === 200) {
          this.graficoMeses = res.data.meses
          this.cumplimientos = res.data.cumplimientos
          this.crearGrafico()
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
    },
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.status === 200) {
          this.clinicasOptions = res.data.clinicas
          this.clinicasOptions.push({ code: '0', label: 'Todas' })
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    getActividades () {
      axios.get('/actividades/fetch').then((response) => {
        this.actividadesOptions = response.data.actividades
        this.actividadesOptions.push({ code: '0', label: 'Todas' })
        this.subactividadesOptions.push({ code: '0', label: 'Todas' })
      })
    },
    getSubactividades () {
      this.subactividad_id = ''
      if (this.actividad_id !== '0') {
        axios
          .get('/subactividades/fetch/' + this.actividad_id)
          .then((response) => {
            this.subactividadesOptions = response.data.subactividades
          })
      } else {
        this.subactividadesOptions = []
        this.subactividadesOptions.push({ code: '0', label: 'Todas' })
      }
    }
  }
}
</script>
