<template>
  <b-container fluid>
    <div>
      <b-modal id="modal-lg" size="lg" title="Agendar Audiencia" @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <input type="hidden" name="hide" v-model="agenda.agen_prore_id">
          <b-form-group
            label="Nombre"
            label-for="name-input"
            invalid-feedback="El nombre es obligatorio"
          >
            <b-form-input
              id="name-input"
              v-model="agenda.agen_name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Asignar Abogada/o:*" label-for="agen_pro_id">
            <b-form-select plain v-model="agenda.agen_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>Seleccione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-row>
            <b-col md="12">
              <b-form-group class="sm-6" label="Notificar desde" label-for="agen_type_not_id">
                <b-form-select v-model="agenda.agen_type_not_id" id="selectuserrole" :options="typeNotificationsOptions">
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="Fecha de Inicio" label-for="agen_start_date">
            <b-form-input id="exampleInputdate" v-model="agenda.agen_start_date" type="date" value="2019-12-18"></b-form-input>
          </b-form-group>
          <b-form-group label="Fecha Final" label-for="agen_end_date">
            <b-form-input id="exampleInputdate" v-model="agenda.agen_end_date" type="date" value="2019-12-18"></b-form-input>
          </b-form-group>
          <b-form-group label="Hora de audiencia" label-for="hora_udiencia">
            <b-form-input id="hora_udiencia" v-model="agenda.sch_start_hour" type="time"></b-form-input>
          </b-form-group>
          <b-form-group label="Hora fin de audiencia" label-for="sch_end_hour">
            <b-form-input id="sch_end_hour" v-model="agenda.sch_end_hour" type="time"></b-form-input>
          </b-form-group>
        </form>
      </b-modal>
    </div>
    <!-- FIN MODAL DE AUDIENCIA -->
    <!-- INICIAL DE MODAL DE ACTUACIÓN -->
    <div>
      <b-modal id="modal-nueva-actuacion" size="lg" title="Agregar actuación" hide-footer>
        <form ref="form">
          <input type="hidden" name="agen_prore_id" v-model="proceeding.proce_prore_id">
          <p v-if="errors.length">
            <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </p>
          <b-row>
            <b-col md="4">
              <b-form-group label="Asignar Abogada/o*" label-for="agen_pro_id">
                <b-form-select plain v-model="proceeding.proce_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>Seleccione abogado</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Tipo de actuación*" label-for="proce_sta_id">
                <v-select
                  v-model="proceeding.proce_sta_id"
                  :options="statusProcessOptions"
                  :reduce="label => label.code"
                  label="label" id="proce_pro_id"
                  >
                  <span slot="no-options">No hay actuaciones.</span>
                </v-select>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Fecha de ingreso*" label-for="proce_fecha_ingreso">
                <b-form-input id="proce_fecha_ingreso" v-model="proceeding.proce_fecha_ingreso" type="date" ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4">
              <b-form-group label="Fecha de actualización*" label-for="proce_fecha_actualizacion">
                <b-form-input id="proce_fecha_actualizacion" v-model="proceeding.proce_fecha_actualizacion" type="date"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Fecha de siguiente audiencia" label-for="proce_fecha_siguiente_audiencia">
                <b-form-input id="proce_fecha_siguiente_audiencia" v-model="proceeding.proce_fecha_siguiente_audiencia" type="date"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Hora de siguiente audiencia" label-for="proce_hora_siguiente_audiencia">
                <b-form-input id="proce_hora_siguiente_audiencia" v-model="proceeding.proce_hora_siguiente_audiencia" type="time"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-textarea v-model="proceeding.proce_descripcion" type="text" placeholder="Descripción de la actuación*"></b-form-textarea>
            </b-col>
          </b-row>
          <b-row>
            <b-col col-auto>
              <b-form-group  label="Nombre del link" label-for="link_proce_id">
                <b-form-input v-model="nuevoLinkProceeding.link_name" type="text" placeholder="Página de Google"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col col-auto>
              <b-form-group  label="URL del link" label-for="imp_nombres">
                <b-form-input v-model="nuevoLinkProceeding.link_url" type="text" placeholder="www.google.com.co"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col class="text-left col-auto">
              <b-form-group  label=" " label-for="link_proce_id">
                <a style="pointer-events:all;" href="#" @click="agregarLinkProceeding"><i class="ri-add-circle-line" style="font-size: 40px;color: green;"></i></a>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <div v-if="linksProceeding !== undefined && linksProceeding !==''">
                <b-table :items="linksProceeding" :fields="columnasLinkActuacion" stacked="md" small>
                  <template #cell(name)="row">
                    {{ row.value.first }} {{ row.value.last }}
                  </template>
                  <template #cell(actions)="row">
                    <b-button size="sm" variant="danger" @click="deleteLinkProceeding(row.index)" :class="estadoBotonEliminarLinkProceeding"> Remover </b-button>
                  </template>
                </b-table>
                <hr>
              </div>
            </b-col>
          </b-row>
          <div class="text-right pt-1">
            <b-button class="sm-3 mr-1" variant="secondary" @click="cancelado">Cancelar</b-button>
            <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarActuacion">{{ textoGuardarActuacion }}</b-button>
          </div>
        </form>
      </b-modal>
    </div>
    <!-- FIN MODAL DE NUEVA ACTUACIÓN -->
    <!-- MODAL PARA ELIMINAR PROCESO-->
    <b-modal id="modal-eliminar-proceso" size="lg" title="Eliminar Procesos" hide-footer>
      <b-row>
        <b-col sm="2">
          <label for="textarea-small">Motivo de eliminación:</label>
        </b-col>
        <b-col sm="10">
          <b-form-textarea
            id="textarea-small"
            :state="comentario_eliminacion.length >= 5"
            v-model="comentario_eliminacion"
          ></b-form-textarea>
          <b-button
            variant="primary"
            @click="deleteProcess"
            style="margin-top:10px;">Eliminar
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
    <!-- FIN MODAL PARA ELIMINAR PROCESO-->
    <!-- MODAL PARA TERMINAR UN PROCESO -->
    <ModalTerminarProceso v-on:actualizarListaProcesos="actualizarLista" :num_radicado="numRadicadoProcesoTerminar" :usr_id="userLogged.usr_id" :prore_id="proceeding.proce_prore_id" v-if="mostrarModalTerminarProceso"  />
    <!-- User Interface controls -->
    <b-row>
      <b-col lg="12">
        <iq-card :key="tableKey">
          <template v-slot:headerTitle>
            <h4 class="card-title">Litigios de resp. médica</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" class="mr-2" @click="importarArchivo" >Importar procesos</b-button>
            <b-button variant="primary" @click="descargarInforme" :class="estadoBotonDescargarInforme">{{ botonDescargarInforme }}</b-button>
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
                    class="w-50"
                  ></b-form-select>
                </b-form-group>
              </b-col>

              <b-col sm="4" md="4" class="my-1">
                <b-form-group
                  label="Clinica"
                  label-cols-sm="2"
                  label-cols-md="2"
                  label-cols-lg="3"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <!-- <b-form-select
                    id="per-page-select"
                    v-model="clinicaId"
                    :options="clinicaOptions"
                    size="sm"
                    class="w-50"
                  ></b-form-select> -->
                  <v-select
                    v-model="clinicaId"
                    :options="clinicaOptions"
                    @input="cambioClinica($event)"
                    :reduce="label => label.code"
                    label="label"
                    id="clinica_id"
                    :class="(errors.length > 0 ? ' is-invalid' : '')"
                    >
                    <span slot="no-options">No hay perfiles.</span>
                  </v-select>
                </b-form-group>
              </b-col>
              <b-col sm="5" md="5" class="my-1">
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
                      v-model="rawInput"
                      type="search"
                      placeholder="Escribe para buscar"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!rawInput" @click="rawInput = ''">{{ accionText }}</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Main table element -->
            <b-table
              :items="process"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="criteria"
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
                  <b-dropdown-item @click="verDetalle(row.item.prore_id)">Abrir</b-dropdown-item>
                  <b-dropdown-item @click="edit(row.item.prore_id)">Editar</b-dropdown-item>
                  <b-dropdown-item v-b-modal.modal-nueva-actuacion @click="agregarActuacion(row.item.prore_id)
                  ">+ Actuación</b-dropdown-item>
                  <b-dropdown-item  v-if="eliminarPerfiles.includes(user_profile)" @click="eliminar(row.item.prore_id)">Eliminar Proceso</b-dropdown-item>
                  <b-dropdown-item v-b-modal.modal-lg @click="sendInfo(row.item.prore_id)">Audiencia</b-dropdown-item>
                  <hr>
                  <b-dropdown-item v-if="row.item.prore_status_process_id != 16" v-b-modal.modal-terminar-proceso @click="verModalTerminarProceso(row.item.prore_id, row.item)"><span class="text-danger">Terminar Proceso</span></b-dropdown-item>
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
          <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
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
      tableKey: 1,
      estadoBotonEliminarLinkProceeding: '',
      mostrarModalTerminarProceso: false,
      numRadicadoProcesoTerminar: '',
      botonDescargarInforme: 'Descargar Informe',
      estadoBotonDescargarInforme: '',
      botonGuardarModal: '',
      textoGuardarActuacion: 'Guardar',
      botonEliminarModal: '',
      accionText: 'Limpiar',
      user_id: '',
      process: [],
      typeNotificationsOptions: [],
      statusProcessOptions: [],
      agenda: {
        agen_name: '',
        agen_pro_id: '',
        agen_start_date: '',
        agen_end_date: '',
        sch_start_hour: '',
        sch_end_hour: '',
        agen_type_eve_id: '',
        agen_type_not_id: ''
      },
      error: {},
      import_file: '',
      errors: [],
      proceeding: {
        proce_id: null,
        proce_prore_id: null,
        proce_pro_id: null,
        proce_sta_id: null,
        proce_fecha_ingreso: null,
        proce_fecha_actualizacion: null,
        proce_descripcion: null,
        proce_fecha_siguiente_audiencia: null,
        proce_hora_siguiente_audiencia: null
      },
      abogadoOptions: [],
      fields: [
        { key: 'prore_num_radicado', label: 'N°', sortable: true, sortDirection: 'desc', class: 'text-left text-uppercase' },
        { key: 'clinica.cli_name', label: 'Clinica', sortable: true, class: 'text-left text-uppercase' },
        {
          key: 'implicateds',
          label: 'Demandante/Demandado',
          formatter: (value, key, item) => {
            let abogadoDemandante = null
            let demandante = null
            for (var i = 0; i < value.length; i++) {
              if (value[i].imp_principal) {
                demandante = value[i].imp_apellidos !== null ? value[i].imp_nombres + ' ' + value[i].imp_apellidos : value[i].imp_nombres
                break
              } else {
                if (value[i].imp_profile_id === 7) {
                  demandante = value[i].imp_apellidos !== null ? value[i].imp_nombres + ' ' + value[i].imp_apellidos : value[i].imp_nombres
                } else if (value[i].imp_profile_id === 6) {
                  abogadoDemandante = value[i].imp_apellidos !== null ? value[i].imp_nombres + ' ' + value[i].imp_apellidos : value[i].imp_nombres
                }
              }
            }
            if (demandante !== null && demandante !== '') {
              return demandante
            } else {
              return abogadoDemandante
            }
          },
          class: 'text-left text-uppercase'
        },
        { key: 'prore_fec_ingreso_jur', label: 'Fec Ingreso', sortable: true, class: 'text-center text-uppercase' },
        { key: 'proceedings.0.status_process.estado_proceso', label: 'Estado del Proceso', sortable: true, class: 'text-left text-uppercase' },
        { key: 'actions', label: 'Acciones', class: 'text-center text-uppercase' }
      ],
      nuevoLinkProceeding: {
        link_name: null,
        link_url: null
      },
      linksProceeding: [],
      columnasLinkActuacion: [
        { key: 'link_name', label: 'Nombre', class: 'text-center' },
        { key: 'link_url', label: 'URL', class: 'text-center' },
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
      rawInput: '',
      criteria: '',
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      clinicaId: null,
      clinicaOptions: [],
      links: {},
      intentos: 0,
      errores: {},
      eliminarPerfiles: [1],
      comentario_eliminacion: '',
      proreIdDelete: '',
      user_profile: null
    }
  },
  created () {
    this.$_timeout = null
  },
  beforeDestroy () {
    clearTimeout(this.$_timeout)
  },
  watch: {
    rawInput (newVal) {
      this.accionText = 'Buscando...'
      clearTimeout(this.$_timeout)
      this.$_timeout = setTimeout(() => {
        this.criteria = newVal
        setTimeout(() => {
          this.accionText = 'Limpiar'
        }, 100)
      }, 1000)
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
    this.getProcess()
    this.fetchOptionsAbogados()
    this.getTypeNotifications()
    setTimeout(() => {
      this.getEstadosProceso()
      this.fetchClinicaOptions()
    }, 500)
  },
  methods: {
    actualizarLista () {
      this.getProcess()
      this.tableKey++
    },
    importarArchivo () {
      this.$router.push({ path: `/process/process-import` })
    },
    fetchClinicaOptions () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/clinicas/obtener-clinicas/' + this.userLogged.usr_id).then(response => {
          this.clinicaOptions = response.data.clinicas
          if (this.clinicaOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
            if (this.clinicaOptions.length === 1) {
              this.clinicaId = this.clinicaOptions[0].code
            } else {
              this.clinicaOptions.push({ code: 0, label: 'Todos' })
            }
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchClinicaOptions()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    getTypeNotifications () {
      axios.get('/type_notifications/fetchTypeNotifications').then(response => {
        this.typeNotificationsOptions = response.data.type_notifications
        if (this.typeNotificationsOptions[0] !== undefined) {
          this.agenda.agen_type_not_id = this.typeNotificationsOptions[0].value
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getTypeNotifications()
            this.intentos++
          }
        })
    },
    getEstadosProceso () {
      axios.get('/statusProcess/fetch').then(response => {
        this.statusProcessOptions = response.data.status_process
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getEstadosProceso()
            this.intentos++
          }
        })
    },
    getProcess () {
      var user = JSON.parse(auth.getUserLogged())
      this.user_id = user.usr_id
      this.user_profile = this.userLogged.user_profile
      axios.get('/process/process-medicos/' + this.user_id).then(response => {
        this.process = response.data.process
        // Set the initial number of items
        this.totalRows = this.process.length
        this.intentos = 0
        this.errores = {}
      })
        .catch(error => {
          this.errores = error
          if (this.intentos < 2) {
            this.getProcess()
            this.intentos++
          }
        })
    },
    edit (item) {
      var editar = true
      this.$router.push({ path: `/process/process-show/${item}/${editar}` })
    },
    verDetalle (proreId) {
      var editar = false
      this.$router.push({ path: `/process/process-show/${proreId}/${editar}` })
    },
    handleOk (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.agenda.aud_name !== '' && this.agenda.aud_pro_id !== '' &&
      this.agenda.agen_start_date !== '' && this.agenda.agen_end_date !== '' && this.agenda.sch_start_hour !== '') {
        // Trigger submit handler
        this.handleSubmit()
      } else {
        Vue.swal('Por favor completa todo el formulario')
      }
    },
    handleSubmit () {
      axios.post('/agenda/guardarAudiencia', this.agenda).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal('Audiencia agendada al proceso correctamente')
          this.$bvModal.hide('modal-lg')
          this.$router.push({ name: 'process.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetchOld').then(response => {
        this.abogadoOptions = response.data.professionals
      })
    },
    sendInfo (proreId) {
      this.agenda.agen_type_not_id = 1
      this.agenda.agen_prore_id = proreId
    },
    info (item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    formatearGenero (generoId) {
      if (generoId === '1') {
        return 'Masculino'
      } else {
        return 'Femenino'
      }
    },
    descargarInforme () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.botonDescargarInforme = 'Descargando informe...'
        this.estadoBotonDescargarInforme = 'disabled'
        axios({
          url: '/process/exportReport/' + this.userLogged.usr_id,
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
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    tipoIdentificacion (tipoIdentificacionId) {
      if (tipoIdentificacionId === 1) {
        return 'C.C'
      } else if (tipoIdentificacionId === 2) {
        return 'T.I'
      } else if (tipoIdentificacionId === 3) {
        return 'C.C'
      } else if (tipoIdentificacionId === 4) {
        return 'NIT'
      }
    },
    agregarActuacion (proreId) {
      this.proceeding.proce_prore_id = proreId
    },
    verModalTerminarProceso (proreId, items) {
      this.numRadicadoProcesoTerminar = items.prore_num_radicado
      this.proceeding.proce_prore_id = proreId
      this.mostrarModalTerminarProceso = true
    },
    guardarActuacion (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.checkFormActuacion()) {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarActuacion = 'Guardando actuación...'
        if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
          this.proceeding.proce_user_id = this.userLogged.usr_id
        }
        axios.post('/proceedings/store', { formulario_proceeding: this.proceeding, links: this.linksProceeding }).then(res => {
          this.textoGuardarActuacion = 'Guardar'
          this.botonGuardarModal = ''
          if (res.data.status_code === 200) {
            Vue.swal(res.data.message)
            this.$bvModal.hide('modal-nueva-actuacion')
            this.limpiarModalActuacion()
          } else {
            Vue.swal(res.data.message)
          }
        })
          .catch((err) => {
            this.textoGuardarActuacion = 'Guardar'
            this.botonGuardarModal = ''
            Vue.swal('Ups, ocurrió un error ' + err)
          })
      } else {
        return false
      }
    },
    checkFormActuacion () {
      if (this.proceeding.proce_pro_id && this.proceeding.proce_sta_id && this.proceeding.proce_fecha_ingreso && this.proceeding.proce_fecha_actualizacion && this.proceeding.proce_descripcion) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.proceeding.proce_pro_id) {
        this.errors.push('El abogado es obligatorio.')
      }
      if (!this.proceeding.proce_sta_id) {
        this.errors.push('La etapa del proceso es obligatoria.')
      }
      if (!this.proceeding.proce_fecha_ingreso) {
        this.errors.push('La fecha de ingreso es obligatoria.')
      }
      if (!this.proceeding.proce_fecha_actualizacion) {
        this.errors.push('La fecha de actualización es obligatoria.')
      }
      if (!this.proceeding.proce_descripcion) {
        this.errors.push('La descripción es obligatoria.')
      }
    },
    cancelado () {
      this.$bvModal.hide('modal-nueva-actuacion')
    },
    limpiarModalActuacion () {
      this.proceeding.proce_prore_id = null
      this.proceeding.proce_pro_id = null
      this.proceeding.proce_sta_id = null
      this.proceeding.proce_fecha_ingreso = null
      this.proceeding.proce_fecha_actualizacion = null
      this.proceeding.proce_descripcion = null
      this.proceeding.proce_fecha_siguiente_audiencia = null
      this.proceeding.proce_hora_siguiente_audiencia = null
    },
    deleteLinkProceeding (proceedingLinkId) {
      this.estadoBotonEliminarLinkProceeding = 'disabled'
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este link?', {
        title: 'Por favor confirmar acción',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Confirmar',
        cancelTitle: 'Cancelar',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          this.estadoBotonEliminarLinkProceeding = ''
          if (value) {
            this.linksProceeding.splice(proceedingLinkId, 1)
          }
        })
        .catch(err => {
          this.estadoBotonEliminarLinkProceeding = ''
          Vue.swal(err)
        })
    },
    cambioClinica (clinicaId) {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('process/obtener-procesos-activos-clinica/' + clinicaId + '/' + this.userLogged.usr_id).then(response => {
          this.process = response.data.process
          // Set the initial number of items
          this.totalRows = this.process.length
          this.intentos = 0
          this.errores = {}
        })
          .catch(error => {
            this.errores = error
            if (this.intentos < 2) {
              this.getProcess()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    agregarLinkProceeding () {
      if (this.nuevoLinkProceeding.link_name === null || this.nuevoLinkProceeding.link_url === null) {
        Vue.swal('Por favor ingrese información del link')
        return false
      } else {
        this.linksProceeding.push({ link_name: this.nuevoLinkProceeding.link_name, link_url: this.nuevoLinkProceeding.link_url })
        this.limpiarNuevoLinkProceeding()
      }
    },
    limpiarNuevoLinkProceeding () {
      this.nuevoLinkProceeding.link_name = null
      this.nuevoLinkProceeding.link_url = null
    },
    eliminar (id) {
      this.proreIdDelete = id
      this.$bvModal.show('modal-eliminar-proceso')
    },
    deleteProcess () {
      if (this.comentario_eliminacion !== null && this.comentario_eliminacion.length > 4) {
        this.$bvModal.hide('modal-eliminar-proceso')
        const dataDelete = {
          prore_id: this.proreIdDelete,
          comentario: this.comentario_eliminacion
        }
        axios.post('/process/delete', dataDelete).then((res) => {
          if (res.status === 200) {
            this.actualizarLista()
          }
          Vue.swal(res.data.message)
        })
          .catch((err) => {
            Vue.swal('Ocurrió un error', err.response.data.message, 'error')
          })
      } else {
        Vue.swal('Falta información', 'Por favor ingrese la descripción del porqué se elimina el caso', 'error')
      }
    }
  }
}
</script>
