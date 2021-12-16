<template>
  <div :id="element"></div>
</template>
<script>
import ApexCharts from 'apexcharts'
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'

export default {
  name: 'GraficaProcesosPorEstados',
  props: ['element', 'clinicasIds'],
  mounted () {
    this.obtenerDatosProcesosPorEstados()
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
            rotate: -60,
            rotateAlways: true,
            minHeight: 150,
            maxHeight: 400
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
    obtenerDatosProcesosPorEstados () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        let _this = this
        let clinicasConsulta = null
        if (_this.clinicasIds != null && _this.clinicasIds !== undefined) {
          clinicasConsulta = _this.clinicasIds
        }
        axios.get('/process/obtener-datos-procesos-por-estados/' + this.userLogged.usr_id + '/' + clinicasConsulta).then(res => {
          if (res.data.status_code === 200) {
            let _this = this
            let selector = '#' + _this.element
            this.intentos = 0
            this.errores = {}
            var cantidad = []
            var estados = []
            let procesosPorEstados = res.data.data
            for (let i = 0; i < procesosPorEstados.length; i++) {
              cantidad.push(procesosPorEstados[i].cantidad)
              estados.push(procesosPorEstados[i].estado)
            }
            this.chartOptions.yaxis.max = procesosPorEstados[0].cantidad + 5
            this.chartOptions.xaxis.categories = estados
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
