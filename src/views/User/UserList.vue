<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Usuarios</h4>
          </template>
          <template v-slot:body>
          <b-row>
            <b-col lg="3" class="my-1">
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

            <b-col lg="9" class="my-1">
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
            :items="usuarios"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            stacked="lg"
            show-empty
            large
            @filtered="onFiltered"
          >
        <template #cell(name)="row">
          {{ row.value.first }} {{ row.value.last }}
        </template>
        <template #cell(actions)="row">
          <!--<b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
            + Info
          </b-button>-->
          <b-button size="sm" @click="row.toggleDetails(); obtenerProcesos(row.item.pro_id, row.detailsShowing, row)" class="mr-1">
            {{ row.detailsShowing ? 'Ocultar' : 'Mostrar' }}
          </b-button>
          <b-button size="sm" variant="primary" @click="editarUsuario(row.item.user_id)">
            Editar
          </b-button>
        </template>
        <template #row-details="row">
          <b-row v-if="procesos.length > 0">
            <b-card v-for="proceso in procesos" :key="proceso.prore_id">
              <b-card-text><b>Procesos Juridicos Asignados a {{ proceso.nombre_abogado }}: </b></b-card-text>
                <!--<b-row  class="col-md-12">-->
              <b-row class="col-md-12 pt-1">
                <b-card-text class="my-0"><b>Etapa procesal:</b> {{ proceso.estado_proceso }} </b-card-text>
              </b-row>
              <hr>
              <b>Información del proceso:</b>
              <b-row class="col-md-12 pt-1">
                <b-card-text class="px-1 my-0"><b>Ciudad: </b>{{ proceso.city_name }}</b-card-text>
                <b-card-text class="pl-3 my-0"><b>Fecha de ingreso: </b>{{ proceso.prore_fec_ingres }}</b-card-text>
                <b-card-text class="pl-3 my-0"><b>Clinica: </b>{{ proceso.cli_name }}</b-card-text>
                <b-card-text class="pl-3 my-0"><b>Fecha del siniestro: </b>{{ proceso.prore_fec_sinister }}</b-card-text>
              </b-row>
              <b-row class="col-md-12 pt-1">
                <b-card-text class="px-1 my-0"><b>Fecha aviso:</b> {{ proceso.prore_fec_sinies_aviso }}</b-card-text>
                <b-card-text class="pl-3 my-0"><b>Fecha de recibo de notificación IPS:</b> {{ proceso.prore_fec_recibo_notify }}</b-card-text>
                <b-card-text class="px-1 my-0"><b>Colaborador de IPS que recibe notificación:</b> {{ proceso.prore_colaborador_ips }}</b-card-text>
              </b-row>
              <b-row class="col-md-12 pt-1">
                <b-card-text class="px-1 my-0"><b>Año de notificación: </b>{{ proceso.prore_year_notify }}</b-card-text>
                <b-card-text class="pl-3 my-0"><b>Fecha notificación prejudicial: </b>{{ proceso.prore_fec_noti_preju }}</b-card-text>
                <b-card-text class="pl-3 my-0"><b>Fecha notificación prejudicial:</b> {{ proceso.prore_fec_audi_conci_preju }}</b-card-text>
              </b-row>
              <b-row class="col-md-12 pt-1">
                <b-card-text class="px-1 my-0"><b>Descripción del siniestro: </b>{{ proceso.prore_sinies_description }}</b-card-text>
              </b-row>
              <hr>
              <b-row class="col-md-12 pt-5">
                <b-button class="mr-2" size="sm" @click="row.toggleDetails">Ocultar</b-button>
                <b-button variant="primary" size="sm" @click="edit(proceso.prore_id)">Editar Proceso</b-button>
              </b-row>
            </b-card>
          </b-row>
          <b-row v-else>
            <b-card>
              <b-card-text>Actualmente no tiene procesos </b-card-text>
            </b-card>
          </b-row>
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
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import iqCard from '../../components/xray/cards/iq-card.vue'
export default {
  components: { iqCard },
  data () {
    return {
      usuarios: [],
      user: {},
      estado: 'd-none',
      bRowLast: {},
      fields: [
        { label: 'Nombre', key: 'usr_name_first', class: 'text-left' },
        { label: 'Apellido', key: 'usr_lastname_first', class: 'text-left' },
        {
          label: 'Identificación',
          key: 'pro_identificacion',
          class: 'text-left'
        },
        { label: 'Correo electronico', key: 'usr_email', class: 'text-left' },
        { label: 'Perfil', key: 'profile_name', class: 'text-center' },
        { label: 'Acciones', key: 'actions', class: 'text-center' }
      ],
      procesos: {},
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: 'Muchas' }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: []
    }
  },
  computed: {
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
    this.getUsers()
    this.totalRows = this.usuarios.length
  },
  methods: {
    add () {
      let obj = this.default()
      this.rows.push(obj)
    },
    getUsers () {
      axios.get('/users').then(response => {
        this.usuarios = response.data.usuarios
      })
    },
    esAbogado (profileId) {
      if (profileId === 2) {
        return true
      } else {
        return false
      }
    },
    editarUsuario (usuarioId) {
      // `/process/process-edit/${item}`
      this.$router.push({ path: `/doctor/profile-edit/${usuarioId}` })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    obtenerProcesos (profesionalId, estaDesplegado, row) {
      if (this.bRowLast.detailsShowing !== undefined) {
        if (this.bRowLast.index !== row.index) {
          this.bRowLast.detailsShowing = true
          this.bRowLast.toggleDetails()
        } else {
          this.bRowLast.detailsShowing = row.detailsShowing
        }
      }
      this.bRowLast = row
      this.procesos = ''
      if (!estaDesplegado) {
        axios.get('/professionals/obtenerProcesos/' + profesionalId).then(res => {
          if (res.data.status_code === 200) {
            this.procesos = res.data.procesos
            // this.estado = ''
            // this.detailsShowing = 'Ocultar'
          } else {
            Vue.swal(res.data.meesage)
          }
        })
          .catch((err) => {
            Vue.swal('Ups sucedió un error tratando de consulta la información. ' + err)
          })
      }
    },
    edit (item) {
      this.$router.push({ path: `/process/process-edit/${item}` })
    }
  }
}
</script>
