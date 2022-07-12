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
                    :options="actividades"
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
            <b-button variant="primary"  @click="getData">Filtrar</b-button>
        </b-col>
    </b-row>
    <div v-if="loadingTable" class="text-center">
      <b-spinner variant="primary" type="grow" label="Loading..."></b-spinner>
    </div>
    <b-table v-else :bordered="true" :items="datosTabla"></b-table>
  </b-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'TablaCumplimiento',
  props: {
    actividades: Array,
    actividad_id: Number,
    clinicasUser: Array
  },
  data () {
    return {
      fechaInicio: moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD'),
      fechaFin: moment(new Date()).format('YYYY-MM-DD'),
      loadingTable: true,
      datosCumplimiento: [],
      meses: [],
      clinicasCode: [],
      datosTabla: [],
      actividadesOptions: [],
      subactividadesOptions: [],
      subactividad_id: '0'
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      for (let clinica of this.clinicasUser) {
        this.clinicasCode.push(clinica.code)
      }
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
          this.subactividadesOptions.push({ code: '0', label: 'Todas' })
        }
      })
    },
    setDataTable () {
      this.datosTabla = []
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
