<template>
  <b-container fluid>
    <b-row v-if="loading">
      <b-col class="py-5" lg="12">
        <b-progress :max="max" height="2rem">
          <b-progress-bar
            :progress_total="progress_total"
            variant="success"
            :style="{ width: progress_total + '%' }"
          >
            <span
              ><b>{{ progress_total }}%</b></span
            >
          </b-progress-bar>
        </b-progress>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col lg="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <b-row>
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Casos por Abogado</h4>
                </template>
                <template v-slot:body>
                  <CasosPorAbogado
                    element="GraficasPorAbogado"
                    :casosAbogado="casosAbogado"
                  />
                </template>
              </iq-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Casos por Clinica</h4>
                </template>
                <template v-slot:body>
                  <CasosPorClinicas
                    element="GraficasPorClinicas"
                    :casosClinicas="casosClinicas"
                  />
                </template>
              </iq-card>
            </b-col>
            <b-col lg="6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4>Casos por Servicio</h4>
                </template>
                <template v-slot:body>
                  <CasosPorSubactividad
                    element="GraficasPorSubactividad"
                    :casosSubactividad="casosSubactividad"
                  />
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
import CasosPorAbogado from './components/CasosPorAbogado.vue'
import CasosPorClinicas from './components/CasosPorClinilca.vue'
import CasosPorSubactividad from './components/CasosPorSubactividad.vue'
import Vue from 'vue'
import axios from 'axios'

export default {
  name: 'GraphsAndReports',
  components: {
    CasosPorAbogado,
    CasosPorClinicas,
    CasosPorSubactividad
  },
  mounted () {
    xray.index()
    this.barraCargando()
    this.obtenerCasosPorAbogado()
    this.obtenerCasosPorClinica()
    this.obtenerCasosPorSubactividad()
  },
  data: function () {
    return {
      progress_total: 4,
      max: 100,
      loading: true,
      casosAbogado: [],
      casosClinicas: [],
      casosSubactividad: []
    }
  },
  methods: {
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) {
          vm.loading = false
          clearInterval(timer)
        }
      }, 100)
    },
    obtenerCasosPorAbogado () {
      axios.get('/casos-abogado').then((res) => {
        if (res.status === 200) {
          this.casosAbogado = res.data.casos
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
    },
    obtenerCasosPorClinica () {
      axios.get('/casos-clinicas').then((res) => {
        if (res.status === 200) {
          this.casosClinicas = res.data.casos
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
    },
    obtenerCasosPorSubactividad () {
      axios.get('/casos-subactividad').then((res) => {
        if (res.status === 200) {
          this.casosSubactividad = res.data.casos
        } else {
          Vue.swal('Ocurrió un error tratando de obtener los datos')
        }
      })
    }
  }
}
</script>

<style>
.iq-card-body {
  flex: unset;
}
</style>
