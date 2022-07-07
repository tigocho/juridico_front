<template>
  <b-container fluid>
     <b-row style="margin-bottom: 10px;">
        <b-col lg="2">
            <b-form-input id="fechaInicio" v-model="fechaInicio" type="date" ></b-form-input>
        </b-col>
         <b-col lg="2">
            <b-form-input id="fechaFin" v-model="fechaFin" type="date" ></b-form-input>
        </b-col>
         <b-col sm="3" md="3" class="my-1">
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
              <b-col lg="1">
            <b-button variant="primary"  @click="getUserClinicas">Filtrar</b-button>
        </b-col>
    </b-row>
    <div v-if="loadingTable" class="text-center">
      <b-spinner variant="primary" type="grow" label="Loading..."></b-spinner>
    </div>
    <b-table v-else :items="datosTabla"></b-table>
  </b-container>
</template>

<script>
import axios from 'axios'
import auth from '@/logic/auth'
import Vue from 'vue'
import moment from 'moment'
export default {
  name: 'TablaCumplimiento',
  data () {
    return {
      fechaInicio: moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD'),
      fechaFin: moment(new Date()).format('YYYY-MM-DD'),
      loadingTable: true,
      datosCumplimiento: [],
      meses: [],
      clinicasUser: [],
      clinicasCode: [],
      datosTabla: [],
      actividad_id: '0',
      actividadesOptions: [],
      subactividadesOptions: [],
      subactividad_id: '0'
    }
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    this.getUserClinicas()
    this.getActividades()
  },
  methods: {
    getData () {
      const dataCumplimiento = {
        fecha_inicio: this.fechaInicio,
        fecha_fin: this.fechaFin,
        clinicas: this.clinicasCode,
        subactividad_id: this.subactividad_id
      }
      axios.post('/casos-cumplimiento/clinica', dataCumplimiento).then((res) => {
        if (res.status === 200) {
          this.datosCumplimiento = res.data.tabla_cumplimiento
          this.meses = res.data.meses
          this.setDataTable()
        }
      })
    },
    getUserClinicas () {
      this.loadingTable = true
      this.datosTabla = []
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.status === 200) {
          this.clinicasUser = res.data.clinicas
          for (let clinica of this.clinicasUser) {
            this.clinicasCode.push(clinica.code)
          }
          this.getData()
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    setDataTable () {
      for (let i = 0; i < this.clinicasUser.length; i++) {
        const fila = {
          Clinica: this.clinicasUser[i].label }

        for (let n = 0; n < this.meses.length; n++) {
          fila[this.meses[n]] = this.datosCumplimiento[i][n] === 0 ? '-' : this.datosCumplimiento[i][n] + ' %'
        }

        this.datosTabla.push(fila)
      }
      this.loadingTable = false
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
