<template>
  <div :id="element"></div>
</template>
<script>
import ApexCharts from 'apexcharts'
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'

export default {
  name: 'IngresosProcesos',
  props: ['element', 'isLive'],
  mounted () {
    this.obtenerDatosGraficaProcesoAnual()
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
      errores: [],
      intentos: 0,
      chartOptions: {
        series: [{
          name: 'Num. de Procesos',
          data: []
        }],
        chart: {
          height: 400,
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
            rotate: -90,
            rotateAlways: true,
            minHeight: 150,
            maxHeight: 600
          },
          categories: [],
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Número de procesosssss'
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
    obtenerDatosGraficaProcesoAnual () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        let _this = this
        axios.get('/process/obtener-datos-grafica-procesos-anual/' + this.userLogged.usr_id).then(res => {
          if (res.data.status_code === 200) {
            let selector = '#' + _this.element
            this.intentos = 0
            this.errores = {}
            let procesosAnual = res.data.process
            var datos = []
            var anios = []
            for (let index = 0; index < procesosAnual.length; index++) {
              datos.push(procesosAnual[index].total)
              anios.push(procesosAnual[index].año)
            }
            this.chartOptions.yaxis.max = datos[0] + 5
            this.chartOptions.xaxis.categories = anios
            this.chartOptions.series[0].data = datos
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
              // this.obtenerDatosProcesosPorClinicas()
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
