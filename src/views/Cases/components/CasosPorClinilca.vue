<template>
  <div>
    <div v-if="casosClinicas.length > 0" :id="element"></div>
    <div v-else>
      <h4 class="col-12 text-center">No hay Casos</h4>
    </div>
  </div>
</template>
<script>
import ApexCharts from 'apexcharts'

export default {
  name: 'GraficaCasosPorClinicas',
  props: {
    element: String,
    casosClinicas: Array
  },
  data () {
    return {
      chartOptions: {
        series: [
          {
            name: 'Num. de Casos',
            data: []
          }
        ],
        chart: {
          height: 500,
          type: 'bar'
        },
        colors: ['#08ab92'],
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top'
            },
            borderRadius: 5,
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
            colors: ['#fff', '#cccccc']
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
            text: 'Número de Casos'
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
  mounted () {
    this.crearGrafico()
  },
  methods: {
    crearGrafico () {
      const selector = '#' + this.element
      const clinicas = []
      const cantidad = []

      for (let caso of this.casosClinicas) {
        cantidad.push(caso.cantidad)
        clinicas.push(caso.clinica)
      }

      const max = Math.max(...cantidad)
      this.chartOptions.yaxis.max = max + 2

      this.chartOptions.xaxis.categories = clinicas
      this.chartOptions.series[0].data = cantidad
      const chart = new ApexCharts(
        document.querySelector(selector),
        this.chartOptions
      )

      chart.render()
    }
  }
}
</script>
