<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <b-row>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-primary rounded">
              <template v-slot:body>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-primary"><i class="ri-user-fill"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ cantidadUsuarios }}</span></h2>
                    <h5 class="">Usuarios</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-warning rounded">
              <template v-slot:body >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-warning"><i class="ri-time-line"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ procesosAbiertos }}</span></h2>
                    <h5 class="">Proc. abiertos</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-success rounded">
              <template v-slot:body >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-success"><i class="ri-checkbox-circle-line"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ procesosCerrados }}</span></h2>
                    <h5 class="">Proc. cerrados</h5>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col md="6" lg="3">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="iq-bg-info rounded">
              <template v-slot:body >
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-info"><i class="ri-government-line"></i></div>
                  <div class="text-right">
                    <h2 class="mb-0"><span class="counter">{{ audienciasPendientes }}</span></h2>
                    <h5 class="">Audiencias</h5>
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
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Información por clínica</h4>
                </template>
                <template v-slot:body>
                  <MorrisChart :element="procesosClinicas.type+1" :type="procesosClinicas.type" :xKeys="procesosClinicas.xKeys" :data="procesosClinicas.bodyData" :colors="procesosClinicas.colors" :yKeys="procesosClinicas.yKeys" :labels="procesosClinicas.labels"/>
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Ingreso de procesos en los últimos 12 meses</h4>
                </template>
                <template v-slot:body>
                  <MorrisChart :element="ingresoProcesos.type+0" :type="ingresoProcesos.type" :xKeys="ingresoProcesos.xKeys" :data="ingresoProcesos.bodyData" :colors="ingresoProcesos.colors" :yKeys="ingresoProcesos.yKeys" :labels="ingresoProcesos.labels"/>
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

export default {
  name: 'Dashboard1',
  mounted () {
    xray.index()
    this.obtenerNumeroUsuarios()
    this.obtenerCantidadProcesosAbiertos()
    this.obtenerCantidadProcesosCerrados()
    this.obtenerCantidadAudienciasPendientes()
    setTimeout(() => {
      this.obtenerDatosGraficaProcesosMensual()
      this.obtenerDatosProcesosPorClinicas()
    }, 500)
  },
  data () {
    return {
      cantidadUsuarios: '',
      procesosAbiertos: '',
      procesosCerrados: '',
      audienciasPendientes: '',
      ingresoProcesos: {
        type: 'bar',
        bodyData: [],
        xKeys: 'mes',
        yKeys: ['total'],
        colors: [ '#36A2EB' ],
        labels: [ 'Procesos' ]
      },
      procesosClinicas: {
        type: 'bar',
        bodyData: [],
        xKeys: 'clinica',
        yKeys: ['total'],
        colors: [ '#36A2EB' ],
        labels: [ 'Cant. Procesos' ]
      },
      intentos: 0,
      errores: {}
    }
  },
  methods: {
    obtenerNumeroUsuarios: function () {
      axios.get('/users/obtenerCantidadUsuarios').then(res => {
        if (res.data.status_code === 200) {
          this.cantidadUsuarios = res.data.cantidad_usuarios
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadProcesosAbiertos: function () {
      axios.get('/process/obtenerCantidadProcesosAbiertos').then(res => {
        if (res.data.status_code === 200) {
          this.procesosAbiertos = res.data.cantidad_procesos_abiertos
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadProcesosCerrados: function () {
      axios.get('/process/obtenerCantidadProcesosCerrados').then(res => {
        if (res.data.status_code === 200) {
          this.procesosCerrados = res.data.cantidad_procesos_cerrados
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerCantidadAudienciasPendientes: function () {
      axios.get('/agenda/obtenerCantidadAudienciasPendientes').then(res => {
        if (res.data.status_code === 200) {
          this.audienciasPendientes = res.data.cantidad_audiencias_pendientes
        } else {
          alert('Datos no validos')
        }
      })
    },
    obtenerDatosGraficaProcesosMensual () {
      axios.get('/process/obtener-datos-grafica-procesos-mensual').then(res => {
        if (res.data.status_code === 200) {
          this.intentos = 0
          this.errores = {}
          let procesosMensual = res.data.process
          this.ingresoProcesos.bodyData = procesosMensual
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.obtenerDatosGraficaProcesosMensual()
            this.intentos++
          }
        })
    },
    obtenerDatosProcesosPorClinicas () {
      axios.get('/process/obtener-datos-procesos-por-clinicas').then(res => {
        if (res.data.status_code === 200) {
          this.intentos = 0
          this.errores = {}
          let procesosPorClinica = res.data.process
          this.procesosClinicas.bodyData = procesosPorClinica
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.obtenerDatosGraficaProcesosMensual()
            this.intentos++
          }
        })
    },
    generateChartData () {
      let chartData = []
      let firstDate = new Date()
      firstDate.setDate(firstDate.getDate() - 1000)
      let visits = 1200
      for (let i = 0; i < 500; i++) {
        let newDate = new Date(firstDate)
        newDate.setDate(newDate.getDate() + i)

        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10)

        chartData.push({
          date: newDate,
          visits: visits
        })
      }
      return chartData
    }
  }
}
</script>

<style>
.iq-card-body{
  flex: unset;
}
</style>
