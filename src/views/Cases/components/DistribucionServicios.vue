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
                    v-model="clinica_id"
                    :options="clinicasUser"
                    :reduce="(label) => label.code"
                    label="label"
                    id="clinica_select"
                  >
                    <span slot="no-options">No hay Clinicas.</span>
                  </v-select>
                </b-form-group>
              </b-col>
               <b-col lg="2">
            <b-button variant="primary" @click="updateGrafico" >Filtrar</b-button>
        </b-col>
    </b-row>
    <div v-if="loadingGraph" class="text-center">
      <b-spinner variant="primary" type="grow" label="Loading..."></b-spinner>
    </div>
    <div  :id="element"></div>
</div>
</template>
<script>
import ApexCharts from 'apexcharts'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'GraficoDistribucionServicios',
  props: {
    element: String,
    clinicasUser: Array
  },
  data () {
    return {
      fechaInicio: moment(new Date()).subtract(4, 'months').format('YYYY-MM-DD'),
      fechaFin: moment(new Date()).format('YYYY-MM-DD'),
      casos: [],
      clinica_id: '0',
      clinicasOptions: [],
      loadingGraph: true,
      onUpdate: false,
      chartOptions: {
        series: [],
        chart: {
          height: 400,
          type: 'donut'
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  showAlways: true,
                  show: true
                }
              }
            }
          }
        },
        labels: [],
        dataLabels: {
          dropShadow: {
            blur: 3,
            opacity: 0.8
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: false
            }
          }
        }],
        legend: {
          position: 'right',
          offsetY: 0,
          height: 230
        }
      }
    }
  },
  mounted () {
    this.getDataGrafico()
  },
  methods: {
    crearGrafico () {
      const selector = '#' + this.element
      const cantidad = []
      const labels = []

      for (let caso of this.casos) {
        cantidad.push(caso.cantidad)
        labels.push(caso.servicio)
      }
      this.chartOptions.series = cantidad
      this.chartOptions.labels = labels

      const chart = new ApexCharts(
        document.querySelector(selector),
        this.chartOptions
      )
      if (this.onUpdate) {
        chart.updateOptions({
          series: cantidad,
          labels: labels
        })
      }
      chart.render()
    },
    getDataGrafico () {
      this.loadingGraph = true
      const dataSend = {
        fecha_inicio: this.fechaInicio,
        fecha_fin: this.fechaFin,
        clinica_id: this.clinica_id
      }
      axios
        .post('/casos/distribucion-servicios', dataSend)
        .then((res) => {
          if (res.status === 200) {
            this.loadingGraph = false
            this.casos = res.data.casos
            this.crearGrafico()
            this.intentos = 0
            this.errors = {}
          }
        })
        .catch((err) => {
          this.errors = err
          if (this.intentos < 2) {
            this.getDataGrafico()
            this.intentos++
          }
        })
    },
    updateGrafico () {
      this.onUpdate = true
      this.getDataGrafico()
    }
  }
}
</script>
