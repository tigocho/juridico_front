<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Polizas Archivadas</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" @click="descargarInforme" :class="estadoBotonDescargarInforme">{{ botonDescargarInforme }}</b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col sm="4" md="3" class="my-1">
                <b-form-group
                  label="Por página"
                  label-for="per-page-select"
                  label-cols-sm="5"
                  label-cols-md="4"
                  label-cols-lg="5"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-form-select
                    id="per-page-select"
                    v-model="perPage"
                    :options="pageOptions"
                    size="sm"
                    class="w-50"
                  ></b-form-select>
                </b-form-group>
              </b-col>

              <b-col sm="8" md="9" class="my-1">
                <b-form-group
                  label="Buscar"
                  label-for="filter-input"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-input"
                      v-model="filter"
                      type="search"
                      placeholder="Escribe para buscar"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Main table element -->
            <b-table
              :items="policies_archived"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :filter-included-fields="filterOn"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              stacked="md"
              show-empty
              small
              @filtered="onFiltered"
            >
              <template #cell(name)="row">
                {{ row.value.first }} {{ row.value.last }}
              </template>

              <template #cell(actions)="row">
                <b-button variant="primary" @click="verDetalle(row.item.pol_id)">Abrir</b-button>
              </template>
            </b-table>
            <b-row>
              <b-col sm="4" md="3" class="my-1 text-righ">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                ></b-pagination>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import auth from '@/logic/auth'
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
const FileDownload = require('js-file-download')

export default {
  data () {
    return {
      numeroPoliza: null,
      botonDescargarInforme: 'Descargar Informe',
      estadoBotonDescargarInforme: 'disabled',
      botonGuardarModal: '',
      textoGuardarAfectacion: 'Guardar',
      aseguradora_id: '',
      user_id: '',
      policies_archived: [],
      afectacionPoliza: {
        pol_affe_pol_id: '',
        pol_affe_prore_id: '',
        pol_affe_valor_bruto: '',
        pol_affe_valor_deducible: '',
        pol_affe_valor_neto: '',
        pol_affe_fecha: '',
        pol_affe_user_id: ''
      },
      error: {},
      aseguradoraOptions: [],
      processOptions: [],
      polizaOptions: [],
      fields: [
        { key: 'pol_numero', label: 'N° Pol.', sortable: true, sortDirection: 'desc', class: 'text-left' },
        { key: 'clinica.cli_name', label: 'Clinica', sortable: true, sortDirection: 'desc', class: 'text-left' },
        { key: 'aseguradora.ase_name', label: 'Aseguradora', sortable: true, class: 'text-left' },
        {
          key: 'pol_total_asegurado',
          label: 'Total Asegurado',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        {
          key: 'pol_cobertura_actual',
          label: 'Cobertura Actual',
          formatter: (value, key, item) => {
            return this.formatPrice(value, key, item)
          },
          class: 'text-center'
        },
        {
          key: 'pol_deducible',
          label: 'Deducible',
          formatter: (value, key, item) => {
            if (value !== '' && value != null) {
              return value + '%'
            } else {
              return '0%'
            }
          },
          class: 'text-center'
        },
        { key: 'actions', label: 'Acciones', class: 'text-center' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: 'Muchas' }],
      sortBy: '',
      sortDesc: false,
      estado_elegido: 'todos',
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      links: {},
      intentos: 0,
      errores: {},
      errors: []
    }
  },
  computed: {
    userLogged () {
      if (auth.getUserLogged() !== undefined) {
        return JSON.parse(auth.getUserLogged())
      } else {
        return null
      }
    },
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted () {
    xray.index()
    this.fetchPolicies()
  },
  methods: {
    fetchPolicies () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/policy/obtener-polizas-archivadas/' + this.userLogged.usr_id).then(response => {
          this.policies_archived = response.data.policies_archived
          if (this.policies_archived[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchPolicies()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    verDetalle (polId) {
      var editar = false
      this.$router.push({ path: `/policies/policy-show/${polId}/${editar}` })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    descargarInforme () {
      this.botonDescargarInforme = 'Descargando informe...'
      this.estadoBotonDescargarInforme = 'disabled'
      axios({
        url: '/process/exportReport',
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        this.botonDescargarInforme = 'Descargar informe'
        this.estadoBotonDescargarInforme = ''
        var fechaHora = moment().format('YYYY-MM-DD hh:mm:ss')
        FileDownload(response.data, 'report-process-activos-' + fechaHora + '.xlsx')
      })
        .catch((err) => {
          this.botonDescargarInforme = 'Descargar informe'
          this.estadoBotonDescargarInforme = ''
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$ ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
</script>
