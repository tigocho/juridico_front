<template>
  <div>
    <b-table :items="process" :fields="fields" striped responsive="sm">
      <template v-slot:cell(prore_defendaant_clin)="data">
        <span v-if="data.item.editable==0">{{
          data.item.prore_defendaant_clin
        }}</span>
        <input
          type="text"
          v-model="data.item.prore_defendaant_clin"
          v-else
          class="form-control"
        />
      </template>
      <template v-slot:cell(prore_pac_age)="data">
        <span v-if="data.item.editable==0">{{
          data.item.prore_pac_age
        }}</span>
        <input
          type="text"
          v-model="data.item.prore_pac_age"
          v-else
          class="form-control"
        />
      </template>
      <template #cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Ocultar' : 'Ver'}} Detalles
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Fecha Ingreso:</b></b-col>
            <b-col>{{ row.item.prore_fec_ingreso }}</b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Año del siniestro:</b></b-col>
            <b-col>{{ row.item.prore_year_sinister }}</b-col>
          </b-row>

          <b-button size="sm" @click="row.toggleDetails">Ocultar Detalles</b-button>
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'
export default {
  data () {
    return {
      process: [],
      fields: [
        { label: 'Clinica ID', key: 'prore_defendaant_clin', class: 'text-left' },
        {
          label: 'Edad',
          key: 'prore_pac_age',
          class: 'text-left'
        },
        { label: 'Ver Detalles', key: 'show_details', class: 'text-left' }
      ],
      items: [
        { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        {
          isActive: false,
          age: 89,
          first_name: 'Geneva',
          last_name: 'Wilson',
          _showDetails: true
        },
        { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
    }
  },
  mounted () {
    xray.index()
    this.getProcess()
  },
  methods: {
    getProcess () {
      axios.get('/process').then(response => {
        this.process = response.data.process
        console.log('processshptaaa: ' + this.process)
      })
    }
  }
}
</script>
