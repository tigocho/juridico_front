<template>
  <b-container fluid>
    <!-- MODAL DE EDITAR CASO -->
    <div>
      <b-modal id="modal-editar-caso" size="lg" title="Editar Caso" hide-footer>
        <FormCase
          :case_id="caso.caso_id"
          :case_title="caso.caso_titulo"
          :case_description="caso.caso_descripcion"
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
        <ValidationObserver ref="form-2" v-slot="{ handleSubmit }">
          <form ref="form-2" @submit.prevent="handleSubmit(SaveAsignacionCaso)">
            <b-row>
              <b-col lg="10" class="pagina-detalle-proceso">
                <p>
                  <strong>{{ caso.caso_titulo }}</strong>
                </p>
                <p>{{ caso.caso_descripcion }}</p>
                <b-form-group label="Abogado*" label-for="profesional_id">
                  <v-select
                    v-model="asginarData.profesional_id"
                    :options="profesionalesOptions"
                    :reduce="(label) => label.code"
                    label="label"
                    id="profesional_id"
                  >
                    <span slot="no-options">No hay Abogados.</span>
                  </v-select>
                </b-form-group>
                <b-row>
                  <b-form-group
                    class="col-md-6"
                    label="Actividad*"
                    label-for="act_id"
                  >
                    <v-select
                      v-model="actividad_id"
                      :options="actividadesOptions"
                      :reduce="(label) => label.code"
                      label="label"
                      id="act_id"
                      @input="getSubactividades"
                    >
                      <span slot="no-options">No hay Actividades.</span>
                    </v-select>
                  </b-form-group>
                  <b-form-group
                    class="col-md-6"
                    label="Subactividad*"
                    label-for="subact_id"
                  >
                    <v-select
                      v-model="asginarData.subactividad_id"
                      :options="subactividadesOptions"
                      :reduce="(label) => label.code"
                      label="label"
                      id="subact_id"
                    >
                      <span slot="no-options">No hay Subctividades.</span>
                    </v-select>
                  </b-form-group>
                </b-row>
                <b-form-group>
                  <b-button variant="primary" type="submit"
                    >Asignar Caso</b-button
                  >
                </b-form-group>
              </b-col>
            </b-row>
          </form>
        </ValidationObserver>
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

              <b-col sm="7" md="7" class="my-1">
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
              <template #cell(name)="row">
                {{ row.value.first }} {{ row.value.last }}
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
import FormCase from '../Cases/components/FormCase.vue'
export default {
  name: 'CasesToAssing',
  components: {
    FormCase
  },
  data () {
    return {
      casos: [],
      caso: {},
      estado: 'd-none',
      actividadesOptions: [],
      subactividadesOptions: [],
      profesionalesOptions: [],
      bRowLast: {},
      actividad_id: '',
      asginarData: {
        subactividad_id: '',
        profesional_id: ''
      },
      fields: [
        { label: 'Título', key: 'caso_titulo', class: 'text-left' },
        { label: 'Descripción', key: 'caso_descripcion', class: 'text-left' },
        { label: 'Estado', key: 'estado', class: 'text-left' },
        {
          label: 'Fecha de Apertura',
          key: 'caso_fecha_apertura',
          class: 'text-left'
        },
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
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    this.getCasosToAssing()
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    getCasosToAssing () {
      this.$bvModal.hide('modal-editar-caso')
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
      this.$bvModal.show('modal-editar-caso')
    },
    asignarCaso (caso) {
      this.getActividades()
      this.getProfesionals()
      this.caso = caso
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
    getActividades () {
      axios.get('/actividades/fetch').then((response) => {
        this.actividadesOptions = response.data.actividades
      })
    },
    getSubactividades () {
      axios
        .get('/subactividades/fetch/' + this.actividad_id)
        .then((response) => {
          this.subactividadesOptions = response.data.subactividades
        })
    },
    getProfesionals () {
      axios.get('/professionals/fetch').then((response) => {
        this.profesionalesOptions = response.data.professionals
      })
    },
    SaveAsignacionCaso () {
      this.$bvModal.hide('modal-asignar-caso')
      axios
        .post('/casos/asignar/' + this.caso.caso_id, this.asginarData)
        .then((res) => {
          if (res.status === 200) {
            this.getCasosToAssing()
          }
          Vue.swal(res.data.message)
        })
    }
  }
}
</script>
