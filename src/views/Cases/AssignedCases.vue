<template>
  <b-container fluid>
    <!-- MODAL DE EDITAR CASO -->
    <div>
      <b-modal id="modal-editar-caso" size="lg" title="Editar Caso" hide-footer>
        <FormCase
          :case_id="caso.caso_id"
          :case_clinica_id="caso.caso_clinica_id"
          :case_title="caso.caso_titulo"
          :case_description="caso.caso_descripcion"
          :case_actividad_id="caso.act_id"
          :case_subactividad_id="caso.caso_subact_id"
          :case_fecha_solicitud="caso.caso_fecha_solicitud"
          :onEdit="true"
          :reloadFunciont="this.getCasosAssignados"
        />
      </b-modal>
    </div>
    <!-- FIN DE MODAL-->
    <!-- DATOS DE CASOS TOTALES, ABIERTOS Y CERRADOS  -->
    <b-row>
      <b-col lg="12">
        <template>
          <ResumenCasos></ResumenCasos>
        </template>
      </b-col>
    </b-row>
    <!-- FIN DATOS DE CASOS TOTALES, ABIERTOS Y CERRADOS  -->
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Casos Asignados</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col sm="2" md="2" class="my-1">
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

              <b-col sm="3" md="3" class="my-1">
                <b-form-group
                  label="Estado"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="2"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="filtros.estado_id"
                    :options="estadosOptions"
                    @input="getCasosAssignados()"
                    :reduce="(label) => label.code"
                    label="label"
                    id="estado_select"
                  >
                    <span slot="no-options">No hay Estados.</span>
                  </v-select>
                </b-form-group>
              </b-col>
              <b-col sm="3" md="3" class="my-1">
                <b-form-group
                  label="Clinicas"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select
                    v-model="filtros.clinica_id"
                    :options="clinicasOptions"
                    @input="getCasosAssignados()"
                    :reduce="(label) => label.code"
                    label="label"
                    id="clinica_select"
                  >
                    <span slot="no-options">No hay Clinicas.</span>
                  </v-select>
                </b-form-group>
              </b-col>

              <b-col sm="4" md="4" class="my-1">
                <b-form-group
                  label="Buscar"
                  label-for="filter-input"
                  label-cols-sm="2"
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
              :tbody-tr-class="rowClass"
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
                    <!-- <b-col>{{ data.item.caso_descripcion }}</b-col> -->
                    <b-col sm="2" class="text-sm-left"
                      ><strong>Servicio: </strong>{{ data.item.servicio }}</b-col
                    >
                    <b-col sm="3" class="text-sm-left"
                      ><strong>Subactividad: </strong>{{ data.item.subactividad }}</b-col
                    >
                  </b-row>
                </b-card>
              </template>
              <template #cell(radicado)="data">
                <b v-if="data.item.lei_leido !== true">
                  {{ data.item.radicado }} <img :src="newCase" width="25px" class="img-fluid" alt="logo">
                </b>
                <b v-else-if="data.item.lei_leido === true && data.item.lei_actualizacion_leida !== true">
                  {{ data.item.radicado }} <img :src="actualizacionCaso" width="25px" class="img-fluid" alt="logo">
                </b>
                <span v-else>{{ data.item.radicado }}</span>
              </template>
              <template #cell(caso_titulo)="data">
                <b v-if="data.item.lei_leido !== true">
                  {{ data.item.caso_titulo }}
                </b>
                <b v-else-if="data.item.lei_leido === true && data.item.lei_actualizacion_leida !== true">
                  {{ data.item.caso_titulo }}
                </b>
                <span v-else>{{ data.item.caso_titulo }}</span>
              </template>
              <template #cell(estado)="data">
                <b v-if="data.item.lei_leido !== true">
                  {{ data.item.estado }}
                </b>
                <b v-else-if="data.item.lei_leido === true && data.item.lei_actualizacion_leida !== true">
                  {{ data.item.estado }}
                </b>
                <span v-else>{{ data.item.estado }}</span>
              </template>
              <template #cell(caso_fecha_apertura)="data">
                <b v-if="data.item.lei_leido !== true">
                  {{ data.item.caso_fecha_apertura }}
                </b>
                <b v-else-if="data.item.lei_leido === true && data.item.lei_actualizacion_leida !== true">
                  {{ data.item.caso_fecha_apertura }}
                </b>
                <span v-else>{{ data.item.caso_fecha_apertura }}</span>
              </template>
              <template #cell(caso_fecha_estimada_solucion)="data">
                <b v-if="data.item.lei_leido !== true">
                  {{ data.item.caso_fecha_estimada_solucion }}
                </b>
                <b v-else-if="data.item.lei_leido === true && data.item.lei_actualizacion_leida !== true">
                  {{ data.item.caso_fecha_estimada_solucion }}
                </b>
                <span v-else>{{ data.item.caso_fecha_estimada_solucion }}</span>
              </template>
              <template #cell(solicitante)="data">
                <b v-if="data.item.lei_leido !== true">
                  {{ data.item.solicitante }}
                </b>
                <b v-else-if="data.item.lei_leido === true && data.item.lei_actualizacion_leida !== true">
                  {{ data.item.solicitante }}
                </b>
                <span v-else>{{ data.item.solicitante }}</span>
              </template>
              <template #cell(actions)="data">
                <b-dropdown variant="primary" text="Acciones">
                  <b-dropdown-item @click="verCaso(data.item.caso_id)">
                    Ver
                  </b-dropdown-item>
                  <b-dropdown-item @click="editarCaso(data.item)">
                    Editar
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="data.item.caso_estado_id != 2"
                    @click="cambiarEstado(data.item, 2)"
                  >
                    En Proceso
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="data.item.caso_estado_id != 4"
                    @click="cambiarEstado(data.item, 4)"
                  >
                    Cerrar
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="deletedProfiles.includes(user_profile)"
                    @click="eliminarCaso(data.item)"
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
import { xray } from '../../config/pluginInit'
import FormCase from '../Cases/components/FormCase.vue'
import ResumenCasos from './components/ResumenCasos.vue'
export default {
  name: 'AssignedCases',
  components: {
    FormCase,
    ResumenCasos
  },
  data () {
    return {
      newCase: require('@/assets/images/page-img/new-case-blue.png'),
      actualizacionCaso: require('@/assets/images/page-img/actualizacion_pendiente_leer.png'),
      casos: [],
      caso: {},
      estado: 'd-none',
      deletedProfiles: [1, 12],
      filtros: {
        clinica_id: '',
        estados_id: ''
      },
      clinicasOptions: [],
      estadosOptions: [],
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
    this.getCasosAssignados()
    this.getUserClinicas()
    this.getEstados()
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    getCasosAssignados () {
      this.$bvModal.hide('modal-editar-caso')
      axios
        .post('/casos-asignados', this.filtros)
        .then((response) => {
          this.casos = response.data.casos
          this.totalRows = this.casos.length
          this.user_profile = this.userLogged.user_profile
        })
    },
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.status === 200) {
          this.clinicasOptions = res.data.clinicas
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    getEstados () {
      axios.get('/estados/fetch').then((response) => {
        this.estadosOptions = response.data.estados
      })
    },
    verCaso (casoId) {
      this.casoVisto(casoId)
      this.$router.push({ path: `/cases/cases-show/${casoId}` })
    },
    editarCaso (caso) {
      this.casoVisto(caso.caso_id)
      this.caso = caso
      this.$bvModal.show('modal-editar-caso')
    },
    eliminarCaso (caso) {
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este Caso?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get('/casos/delete/' + caso.caso_id)
            .then((res) => {
              if (res.status === 200) {
                this.casoVisto(caso.caso_id)
                this.getCasosAssignados()
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
    cambiarEstado (caso, estadoId) {
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text:
          estadoId === 2
            ? '¿Deseas poner este Caso en proceso?'
            : estadoId === 3
              ? '¿Deseas poner este Caso en espera?'
              : '¿Deseas Cerrar este Caso?',
        showCancelButton: true,
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get('/casos-estado/' + caso.caso_id + '/' + estadoId)
            .then((res) => {
              if (res.status === 200) {
                this.casoVisto(caso.caso_id)
                this.getCasosAssignados()
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
    rowClass (item) {
      if (item !== null && item.caso_estado_id === 3) return 'table-devolucion'
    },
    casoVisto (casoId) {
      axios.post('/casos/leido/' + casoId)
        .then((res) => {
          this.casos.map(function (dato) {
            if (dato.caso_id === casoId) {
              dato.lei_leido = true
            }
          })
        })
    }
  }
}
</script>
