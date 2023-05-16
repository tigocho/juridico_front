<template>
  <b-container fluid>
    <b-row style="padding-bottom: 10px;">
      <b-col lg="12">
        <b-row class="row-estadistica">
          <b-col md="6" lg="4">
            <div>
              <template>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-primary">
                    <i class="ri-bar-chart-line"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{ casos.total }}</span>
                    </h2>
                    <h5 class="">Total casos</h5>
                  </div>
                </div>
              </template>
            </div>
          </b-col>
          <b-col md="6" lg="4">
            <div>
              <template>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-warning">
                    <i class="ri-time-line"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{ casos.abiertos }}</span>
                    </h2>
                    <h5 class="">Casos abiertos</h5>
                  </div>
                </div>
              </template>
            </div>
          </b-col>
          <b-col md="6" lg="4">
            <div>
              <template>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="rounded-circle iq-card-icon bg-danger">
                    <i class="ri-close-circle-line"></i>
                  </div>
                  <div class="text-right">
                    <h2 class="mb-0">
                      <span class="counter">{{ casos.cerrados }}</span>
                    </h2>
                    <h5 class="">Casos cerrados</h5>
                  </div>
                </div>
              </template>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
import { xray } from '../../../config/pluginInit'

export default {
  name: 'ResumenCasos',
  data () {
    return {
      casos: {
        abiertos: 0,
        total: 0,
        cerrados: 0
      },
      datosKey: 0,
      intentos: 0,
      errores: null
    }
  },
  mounted () {
    this.obtenerDatos()
    xray.index()
  },
  methods: {
    obtenerDatos () {
      axios
        .get('/casos/obtenerCantidades')
        .then((response) => {
          this.casos = response.data.casos
          this.intentos = 0
        })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.obtenerDatos()
          }
          this.intentos++
        })
    }
  }
}
</script>
<style>
.iq-card-body{
  flex: unset;
}
.row-estadistica{
  background: #fff;
  padding: 10px;
  border-radius: 20px;
}
</style>
