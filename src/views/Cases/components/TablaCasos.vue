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
          :reloadFunciont="this.actualizarCaso(caso)"
        />
      </b-modal>
    </div>
    <!-- FIN DE MODAL-->
    <b-row>
      <b-col lg="12">
        <iq-card>
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
            :tbody-tr-class="rowClass(casos)"
          >
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
            <template #cell(fecha_solucion)="data">
              <b v-if="data.item.lei_leido !== true">{{ data.item.fecha_solucion }}</b>
              <span v-else>{{ data.item.fecha_solucion }}</span>
            </template>
            <template #cell(solicitante)="data">
              <b v-if="data.item.lei_leido !== true">{{ data.item.solicitante }}</b>
              <span v-else>{{ data.item.solicitante }}</span>
            </template>
            <template #cell(abogado)="data">
              <b v-if="data.item.lei_leido !== true">{{ data.item.abogado }}</b>
              <span v-else>{{ data.item.abogado }}</span>
            </template>
            <template #cell(actions)="row">
              <b-dropdown variant="primary" text="Acciones">
                <b-dropdown-item @click="verCaso(row.item.caso_id)">
                  Ver
                </b-dropdown-item>
                <b-dropdown-item @click="editarCaso(row.item)">
                  Editar
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="anularPerfiles.includes(user_profile)"
                  @click="anularCaso(row.item.caso_id)"
                >
                  Anular
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="user_profile == 1"
                  @click="eliminarCaso(row.item.caso_id)"
                >
                  Eliminar
                </b-dropdown-item>
              </b-dropdown>
            </template>
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
            <template #row-details="row">
              <b-card>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"
                    ><strong>Servicio:</strong></b-col
                  >
                  <b-col>{{ row.item.servicio }}</b-col>
                  <b-col sm="3" class="text-sm-right"
                    ><strong>Subactividad:</strong></b-col
                  >
                  <b-col>{{ row.item.subactividad }}</b-col>
                </b-row>
              </b-card>
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
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from 'axios'
import FormCase from './FormCase.vue'
export default {
  name: 'TablaCasos',
  components: {
    FormCase
  },
  props: {
    casos: Array,
    perPageData: Number,
    filterData: String
  },
  data () {
    return {
      caso: {},
      newCase: require('@/assets/images/page-img/new-case-red.png'),
      fields: [
        { label: 'Ver Más', key: 'show_details', class: 'text-left' },
        {
          label: 'Radicado',
          key: 'radicado'
        },
        { label: 'Título', key: 'caso_titulo', class: 'text-left' },
        { label: 'Estado', key: 'estado', class: 'text-left' },
        {
          label: 'Fecha de Apertura',
          key: 'caso_fecha_apertura',
          class: 'text-left'
        },
        {
          label: 'Fecha estimada Solución',
          key: 'fecha_solucion',
          class: 'text-left'
        },
        { label: 'Solicitante', key: 'solicitante', class: 'text-left' },
        { label: 'Abogado Asignado', key: 'abogado', class: 'text-left' },
        { label: 'Acciones', key: 'actions', class: 'text-center' }
      ],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      perPage: 5,
      filter: null,
      filterOn: [],
      anularPerfiles: [1, 12],
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
    }
  },
  mounted () {
    this.perPage = this.perPageData
    this.filter = this.filterData
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    rowClass (item) {
      if (item.caso_estado_id === 3) return 'table-devolucion'
    },
    editarCaso (caso) {
      this.casoVisto(caso.caso_id)
      this.caso = caso
      this.$bvModal.show('modal-editar-caso')
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
    },
    actualizarCaso (casoId) {
      this.casos.map(function (dato) {
        if (dato.caso_id === casoId) {
          dato = this.caso
        }
      })
    }
  }
}
</script>
