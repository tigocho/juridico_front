<template>
  <div>
      <div :id="element"></div>
    <div v-if="!hasData">
      <h4 class="col-12 text-center">No hay procesos de esta clínica asignados a una Poliza/Aseguradora</h4>
    </div>
  </div>
</template>
<script>
import ApexCharts from 'apexcharts'
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'

export default {
  name: 'GraficaProcesosPorAseguradora',
  props: ['element', 'clinicasIds', 'tipoProceso'],
  mounted () {
    this.obtenerDatosProcesosPorAseguradora()
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  data () {
    return {
      max: 0,
      errores: [],
      hasData: false,
      intentos: 0,
      chartOptions: {
        series: [{
          name: 'Num. de Procesos',
          data: []
        }],
        chart: {
          height: 500,
          type: 'bar'
        },
        colors: ['#089bab'],
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top'
            },
            columnWidth: '80%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true,
          position: 'top',
          style: {
            colors: ['#089bab']
          },
          offsetY: -25
        },
        stroke: {
          width: 2
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        xaxis: {
          type: 'category',
          labels: {
            rotateAlways: true,
            minHeight: 150,
            maxHeight: 1000,
            trim: true
          },
          categories: [],
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Número de procesos'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        }
      }
    }
  },
  methods: {
    obtenerDatosProcesosPorAseguradora () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        let _this = this
        let clinicasConsulta = null
        if (_this.clinicasIds != null && _this.clinicasIds !== undefined) {
          clinicasConsulta = _this.clinicasIds
        }
        axios.get('/aseguradora/obtenerCantidadProcesosPorAseguradora/' + this.userLogged.usr_id + '/' + clinicasConsulta + '/' + this.tipoProceso).then(res => {
          if (res.data.status_code === 200) {
            let _this = this
            let selector = '#' + _this.element
            this.intentos = 0
            this.errores = {}
            var cantidad = []
            var aseguradoras = []
            let procesosPorAseguradora = res.data.procesos_por_aseguradora
            if (procesosPorAseguradora.length > 0) {
              this.hasData = true
            }
            for (let i = 0; i < procesosPorAseguradora.length; i++) {
              cantidad.push(procesosPorAseguradora[i].cantidad)
              aseguradoras.push(procesosPorAseguradora[i].aseguradora)
            }
            this.chartOptions.yaxis.max = procesosPorAseguradora[0].cantidad + 3
            this.chartOptions.yaxis.tickAmount = procesosPorAseguradora[0].cantidad + 3
            this.chartOptions.xaxis.categories = aseguradoras
            this.chartOptions.series[0].data = cantidad
            let chart = new ApexCharts(document.querySelector(selector), this.chartOptions)
            setTimeout(function () {
              chart.render()
            }, 500)
          } else {
            Vue.swal('Ocurrió un error tratando de obtener los datos')
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.intentos++
            }
          })
      } else {
        Vue.swal('Algo salio mal')
      }
    }
  }
}
</script>
