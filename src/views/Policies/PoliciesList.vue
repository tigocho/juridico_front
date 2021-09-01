<template>
  <b-container fluid>
    <div>
      <!-- INICIO MODAL DE AFECTACIÓN -->
      <b-modal id="modal-nueva-afectacion" size="lg" title="Agregar Afectación" hide-footer>
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <p v-if="errors.length">
            <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </p>
          <h6 class="py-1" v-if="numeroPoliza != null && numeroPoliza !== ''">Número de póliza: <b>{{ numeroPoliza }}</b></h6>
          <b-form-group label="Proceso que afectó la poliza*" label-for="pol_affe_prore_id">
            <v-select v-model="afectacionPoliza.pol_affe_prore_id" :options="processOptions" :reduce="label => label.code" label="label" id="pol_ase_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
              <span slot="no-options">No hay procesos.</span>
            </v-select>
          </b-form-group>
          <b-row>
            <b-col md="6">
              <b-form-group label="Valor bruto de la afectación (Sin deducible)" label-for="pol_affe_valor_bruto">
                <b-form-input id="pol_affe_valor_bruto" @change="valorNetoAfectacion" v-model="afectacionPoliza.pol_affe_valor_bruto" type="number"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Deducible" label-for="pol_affe_valor_deducible">
                <b-form-input id="pol_affe_valor_bruto" @change="valorNetoAfectacion" v-model="afectacionPoliza.pol_affe_valor_deducible" type="number"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label="Valor neto de la afectación" label-for="pol_affe_valor_neto">
              <b-form-input id="pol_affe_valor_neto" v-model="afectacionPoliza.pol_affe_valor_neto" type="number"></b-form-input>
            </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Fecha de afectación" label-for="pol_affe_fecha">
              <b-form-input id="pol_affe_fecha" v-model="afectacionPoliza.pol_affe_fecha" type="date"></b-form-input>
            </b-form-group>
            </b-col>
          </b-row>
          <div class="text-right pt-1">
            <b-button class="sm-3 mr-1" variant="secondary" @click="cancelado">Cancelar</b-button>
            <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarAfectacion">{{ textoGuardarAfectacion }}</b-button>
          </div>
        </form>
      </b-modal>
    </div>
    <!-- FIN MODAL DE AFECTACIÓN -->
    <!-- User Interface controls -->
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Polizas</h4>
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
              :items="policies"
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
                <b-dropdown variant="primary" text="Acciones">
                  <b-dropdown-item @click="verDetalle(row.item.pol_id)">Abrir</b-dropdown-item>
                  <b-dropdown-item @click="edit(row.item.pol_id)">Editar</b-dropdown-item>
                  <b-dropdown-item v-b-modal.modal-nueva-afectacion @click="agregarAfectacion(row.item.pol_numero, row.item.pol_id)">Nueva afectación</b-dropdown-item>
                </b-dropdown>
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
      policies: [],
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
      return JSON.parse(auth.getUserLogged())
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
    this.fetchProcessOptions()
    this.fetchAseguradoraOptions()
    setTimeout(() => {
      // this.getEstadosProceso()
    }, 500)
  },
  methods: {
    importarArchivo () {
      this.$router.push({ path: `/process/process-import` })
    },
    fetchPolicies () {
      axios.get('/policy/obtener-polizas').then(response => {
        this.policies = response.data.policies
        if (this.policies[0] !== undefined) {
          this.totalRows = this.policies.length
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
    },
    fetchProcessOptions () {
      axios.get('/process/obtenerProcesosParaLista').then(response => {
        this.processOptions = response.data.process
        if (this.processOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchProcessOptions()
            this.intentos++
          }
        })
    },
    fetchAseguradoraOptions () {
      axios.get('/aseguradoras/fetch-aseguradoras').then(response => {
        this.aseguradoraOptions = response.data.aseguradoras
        if (this.aseguradoraOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchAseguradoraOptions()
            this.intentos++
          }
        })
    },
    edit (item) {
      var editar = true
      this.$router.push({ path: `/policies/policy-show/${item}/${editar}` })
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
    agregarAfectacion (numeroPoliza, polId) {
      this.numeroPoliza = numeroPoliza
      this.afectacionPoliza.pol_affe_pol_id = polId
    },
    guardarAfectacion (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.checkFormAfectacion()) {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarAfectacion = 'Guardando afectación...'
        const token = localStorage.getItem('access_token')
        if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
          this.afectacionPoliza.pol_affe_user_id = this.userLogged.usr_id
        }
        axios.post('/policyAffectation/registrar-afectacion', this.afectacionPoliza, { headers: { 'Authorization': token } }).then(res => {
          this.textoGuardarAfectacion = 'Guardar'
          this.botonGuardarModal = ''
          if (res.data.status_code === 200) {
            Vue.swal(res.data.message)
            this.$bvModal.hide('modal-nueva-afectacion')
            this.limpiarModalAfectacion()
          } else {
            Vue.swal(res.data.message)
          }
        })
          .catch((err) => {
            this.textoGuardarAfectacion = 'Guardar'
            this.botonGuardarModal = ''
            Vue.swal('Ups, ocurrió un error ' + err)
          })
      } else {
        return false
      }
    },
    checkFormAfectacion () {
      if (this.afectacionPoliza.pol_affe_pol_id && this.afectacionPoliza.pol_affe_prore_id &&
        this.afectacionPoliza.pol_affe_valor_bruto && this.afectacionPoliza.pol_affe_valor_deducible &&
        this.afectacionPoliza.pol_affe_valor_neto && this.afectacionPoliza.pol_affe_fecha) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.afectacionPoliza.pol_affe_prore_id) {
        this.errors.push('El proceso es obligatorio.')
      }
      if (!this.afectacionPoliza.pol_affe_valor_bruto) {
        this.errors.push('El valor bruto es obligatorio.')
      }
      if (!this.afectacionPoliza.pol_affe_valor_deducible) {
        this.errors.push('El valor deducido es obligatoria.')
      }
      if (!this.afectacionPoliza.pol_affe_valor_neto) {
        this.errors.push('El valor neto es obligatorio.')
      }
      if (!this.afectacionPoliza.pol_affe_fecha) {
        this.errors.push('La fecha es obligatoria.')
      }
    },
    cancelado () {
      this.$bvModal.hide('modal-nueva-afectacion')
    },
    limpiarModalAfectacion () {
      this.afectacionPoliza.pol_affe_pol_id = null
      this.afectacionPoliza.pol_affe_prore_id = null
      this.numeroPoliza = null
      this.afectacionPoliza.pol_affe_valor_bruto = null
      this.afectacionPoliza.pol_affe_valor_deducible = null
      this.afectacionPoliza.pol_affe_valor_neto = null
      this.afectacionPoliza.pol_affe_fecha = null
      this.afectacionPoliza.pol_affe_user_id = null
    },
    valorNetoAfectacion () {
      let valorBruto = this.afectacionPoliza.pol_affe_valor_bruto > 0 ? this.afectacionPoliza.pol_affe_valor_bruto : 0
      let deducible = this.afectacionPoliza.pol_affe_valor_deducible > 0 ? this.afectacionPoliza.pol_affe_valor_deducible : 0
      this.afectacionPoliza.pol_affe_valor_neto = parseInt(valorBruto) - parseInt(deducible)
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$ ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
</script>
