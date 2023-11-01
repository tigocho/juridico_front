<template>
  <b-container fluid>
    <!-- MODAL DE EDITAR TUTELA -->
    <div>
      <b-modal id="modal-editar-tutela" size="lg" title="Editar Tutela" hide-footer>
        <FormularioTutela
          :case_id="caso.caso_id"
          :case_clinica_id="caso.caso_clinica_id"
          :case_title="caso.caso_titulo"
          :case_description="caso.caso_descripcion"
          :case_actividad_id="caso.act_id"
          :case_subactividad_id="caso.caso_subact_id"
          :case_fecha_solicitud="caso.caso_fecha_solicitud"
          :onEdit="true"
          :reloadFunciont="this.getCasosToAssing"
        />
      </b-modal>
    </div>
    <!-- FIN DE MODAL-->
    <!-- MODAL DE ASIGNAR CASO -->
    <div>
      <b-modal
        id="modal-asignar-caso"
        size="lg"
        title="Asignar Caso"
        hide-footer
      >
        <!-- INICIO DE COMPONENTE ASIGNAR CASO-->
        <asignar-tutela
          :casoInfo="caso"
          :archivos="archivos"
          :descargarArchivoCaso="descargarArchivoCaso"
          :recargarCaso="getCasosToAssing"
          @cerrar="cerrarModalAsignarCaso"
        ></asignar-tutela>
        <!-- FIN DE COMPONENTE ASIGNAR CASO-->
      </b-modal>
    </div>
    <!-- FIN DE MODAL-->
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Casos Por Asignar</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col sm="3" md="3" class="my-1">
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
                    class="w-80"
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
                      <b-button :disabled="!filter" @click="filter = ''"
                        >Limpiar</b-button
                      >
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table
              :items="casos"
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
              <template #cell(show_details)="row">
                <b-button
                  variant="primary"
                  size="sm"
                  @click="row.toggleDetails"
                  class="mr-2"
                >
                  {{ row.detailsShowing ? '-' : '+' }}
                </b-button>
              </template>
              <template #row-details="data">
                <b-card>
                  <b-row class="mb-12">
                    <b-col sm="12" class="text-sm-left"
                      ><strong>Descripción: </strong>{{ data.item.caso_descripcion }}</b-col
                    >
                  </b-row>
                  <b-row>
                    <b-col sm="2" class="text-sm-left">
                      <strong>Servicio: </strong>{{ data.item.servicio }}
                    </b-col>
                    <b-col sm="3" class="text-sm-left">
                      <strong>Subactividad: </strong>{{ data.item.subactividad }}
                    </b-col>
                  </b-row>
                </b-card>
              </template>
              <template #cell(radicado)="data">
                <b v-if="data.item.lei_leido !== true">{{ data.item.radicado }} <img :src="newCase" width="25px" class="img-fluid" alt="logo"></b>
                <span v-else>{{ data.item.radicado }}</span>
              </template>
              <template #cell(caso_titulo)="data">
                <b v-if="data.item.lei_leido !== true">{{ data.item.caso_titulo }}</b>
                <span v-else>{{ data.item.caso_titulo }}</span>
              </template>
              <template #cell(estado)="data">
                <b v-if="data.item.lei_leido !== true">{{ data.item.estado }}</b>
                <span v-else>{{ data.item.estado }}</span>
              </template>
              <template #cell(caso_fecha_apertura)="data">
                <b v-if="data.item.lei_leido !== true">{{ data.item.caso_fecha_apertura }}</b>
                <span v-else>{{ data.item.caso_fecha_apertura }}</span>
              </template>
              <template #cell(caso_fecha_estimada_solucion)="data">
                <b v-if="data.item.lei_leido !== true">{{ data.item.caso_fecha_estimada_solucion }}</b>
                <span v-else>{{ data.item.caso_fecha_estimada_solucion }}</span>
              </template>
              <template #cell(solicitante)="data">
                <b v-if="data.item.lei_leido !== true">{{ data.item.solicitante }}</b>
                <span v-else>{{ data.item.solicitante }}</span>
              </template>
              <template #cell(actions)="row">
                <b-dropdown variant="primary" text="Acciones">
                  <b-dropdown-item @click="verCaso(row.item.caso_id)">
                    Ver
                  </b-dropdown-item>
                  <b-dropdown-item @click="editarCaso(row.item)">
                    Editar
                  </b-dropdown-item>
                  <b-dropdown-item @click="asignarCaso(row.item)">
                    Asignar
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="user_profile == 1"
                    @click="eliminarCaso(row.item.caso_id)"
                  >
                    Eliminar
                  </b-dropdown-item>
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
import axios from 'axios'
import auth from '@/logic/auth'
import Vue from 'vue'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import FormularioTutela from '../Tutelas/components/FormularioTutela.vue'
import { xray } from '../../config/pluginInit'
import fileDownload from 'js-file-download'
import AsignarTutela from './components/AsignarTutela.vue'
export default {
  name: 'TutelaParaAsignar',
  components: {
    FormularioTutela,
    AsignarTutela
  },
  data () {
    return {
      newCase: require('@/assets/images/page-img/new-case-blue.png'),
      casos: [],
      caso: {},
      archivos: [],
      estado: 'd-none',
      bRowLast: {},
      fields: [
        { label: 'Ver Más', key: 'show_details', class: 'text-left' },
        { label: 'Radicado', key: 'radicado' },
        { label: 'Título', key: 'caso_titulo', class: 'text-left' },
        { label: 'Estado', key: 'estado', class: 'text-left' },
        {
          label: 'Fecha de Apertura',
          key: 'caso_fecha_apertura',
          class: 'text-left'
        },
        {
          label: 'Fecha estimada Solución',
          key: 'caso_fecha_estimada_solucion',
          class: 'text-left'
        },
        { label: 'Solicitante', key: 'solicitante', class: 'text-left' },
        { label: 'Acciones', key: 'actions', class: 'text-center' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: 'Muchas' }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      user_profile: null
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key }
        })
    },
    userLogged () {
      if (auth.getUserLogged() !== undefined) {
        return JSON.parse(auth.getUserLogged())
      } else {
        return null
      }
    }
  },
  mounted () {
    xray.index()
    this.getCasosToAssing()
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    getCasosToAssing () {
      this.$bvModal.hide('modal-editar-tutela')
      axios.get('/casos/por-asignar').then((response) => {
        this.casos = response.data.casos
        this.totalRows = this.casos.length
        this.user_profile = this.userLogged.user_profile
      })
    },
    verCaso (casoId) {
      this.$router.push({ path: `/cases/cases-show/${casoId}` })
    },
    editarCaso (caso) {
      this.caso = caso
      this.$bvModal.show('modal-editar-tutela')
    },
    asignarCaso (caso) {
      this.caso = caso
      this.archivos = caso.archivos
      this.$bvModal.show('modal-asignar-caso')
    },
    eliminarCaso (casoId) {
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este Caso?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get('/casos/delete/' + casoId)
            .then((res) => {
              if (res.status === 200) {
                this.getCasosToAssing()
              }
              Vue.swal(res.data.message)
            })
            .catch((err) => {
              Vue.swal(
                'Ups sucedió un error tratando de consulta la información. ' +
                  err
              )
            })
        }
      })
    },
    cerrarModalAsignarCaso () {
      this.$bvModal.hide('modal-asignar-caso')
    },
    descargarArchivoCaso (filename, id) {
      axios({
        url: '/casos/descargar-archivo/' + id,
        method: 'GET',
        responseType: 'blob'
      })
        .then((response) => {
          if (response.headers['content-type'] === 'application/json') {
            Vue.swal('Ups, el archivo no existe')
          } else {
            fileDownload(response.data, filename)
            Vue.swal('Descarga éxitosa')
          }
        })
        .catch((err) => {
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    }
  }
}
</script>
