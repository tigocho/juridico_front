<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Mis Casos</h4>
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

            <b-col sm="3" md="3" class="my-1">
                <b-form-group
                  label="Filtrar"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <v-select >
                    <span slot="no-options">No hay estados.</span>
                  </v-select>
                </b-form-group>
              </b-col>

            <b-col sm="6" md="6" class="my-1">
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
              <b-dropdown-item @click="eliminarcaso(row.item.caso_id)" >
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

export default {
  name: 'MyCases',
  data () {
    return {
      casos: [],
      estado: 'd-none',
      bRowLast: {},
      fields: [
        { label: 'Título', key: 'caso_titulo', class: 'text-left' },
        { label: 'Descripción', key: 'caso_descripcion', class: 'text-left' },
        { label: 'Estado', key: 'estado', class: 'text-left' },
        { label: 'Fecha de Apertura', key: 'caso_fecha_apertura', class: 'text-left' },
        { label: 'Fecha estimada Solución', key: 'caso_fecha_estimada_solucion', class: 'text-left' },
        { label: 'Abogado Asignado', key: 'abogado', class: 'text-left' },
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
    },
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    this.getMyCasos()
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    getMyCasos () {
      axios.get('/mycases/' + this.userLogged.usr_id).then(response => {
        this.casos = response.data.casos
        this.totalRows = this.casos.length
      })
    },
    verCaso (casoId) {
      this.$router.push({ path: `/cases/cases-show/${casoId}` })
    }
  }
}
</script>
