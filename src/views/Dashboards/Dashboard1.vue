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
          <template v-slot:body>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import IqCard from '../../components/xray/cards/iq-card'
import axios from 'axios'

export default {
  name: 'Dashboard1',
  components: { IqCard },
  mounted () {
    xray.index()
    this.obtenerNumeroUsuarios()
    this.obtenerCantidadProcesosAbiertos()
    this.obtenerCantidadProcesosCerrados()
    this.obtenerCantidadAudienciasPendientes()
  },
  data () {
    return {
      cantidadUsuarios: '',
      procesosAbiertos: '',
      procesosCerrados: '',
      audienciasPendientes: ''
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
    }
  }
}
</script>

<style>
.iq-card-body{
  flex: unset;
}
</style>
