<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <form class="mt-4" @submit.prevent="handleSubmit(onSubmit)">
            <b-row>
              <b-col lg="12">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">Guardar Caso</h4>
                    <p>Campos marcados con * son obligatorios</p>
                  </template>
                  <template v-slot:body>
                    <b-row>
                      <b-col lg="12">
                        <b-row>
                          <b-form-group
                            class="col-md-6"
                            label="Clinica*"
                            label-for="clinica_id"
                          >
                            <ValidationProvider
                              name="clinicas"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.clinica_id"
                                :options="clinicasOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="clinica_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                                @input="getClientes($event)"
                              >
                                <span slot="no-options">No hay clinicas.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar una clinicas</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group
                            class="col-md-6"
                            label="Solicitante*"
                            label-for="user_id"
                          >
                            <ValidationProvider
                              name="Cliente"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.user_id"
                                :options="clientesOptions"
                                :reduce="(label) => label.code"
                                @input="getUserClinicas"
                                label="label"
                                id="user_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Clientes.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un cliente</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group
                            class="col-md-6"
                            label="Tipo de servicio*"
                            label-for="servicio_id"
                          >
                            <ValidationProvider
                              name="Servicio"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.servicio_id"
                                :options="serviciosOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="servicio_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Servicios.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un Servicio</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group
                            class="col-md-6"
                            label="Asignado a *"
                            label-for="abogado_id"
                          >
                            <ValidationProvider
                              name="abogado"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.abogado_id"
                                :options="abogadosOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="abogado_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Abogados.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un abogado</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                        </b-row>
                        <b-row>
                          <b-form-group
                            class="col-md-6"
                            label="Actividad*"
                            label-for="actividad_id"
                          >
                            <ValidationProvider
                              name="Actividad"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="actividad_id"
                                :options="actividadesOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="actividad_id"
                                @input="getSubactividades"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Actividad.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar una Actividad</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group
                            class="col-md-6"
                            label="Tipo*"
                            label-for="subactividad_id"
                          >
                            <ValidationProvider
                              name="Tipo"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                @input="getTiempoAns"
                                v-model="caso.subactividad_id"
                                :options="subactividadOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="subactividad_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options"
                                  >No hay Tipos de Actividad.</span
                                >
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un Tipo</span>
                              </div>
                            </ValidationProvider>
                            <p
                              :key="fechaSolucionKey"
                              class="text-left"
                              v-if="fechaSolucion !== null"
                            >
                              Fecha apróximada de solución o respuesta:
                              {{ fechaSolucion }}
                            </p>
                          </b-form-group>
                        </b-row>
                        <b-row>
                          <b-form-group
                            class="col-md-6"
                            label="Medio Solicitud*"
                            label-for="medio_id"
                          >
                            <ValidationProvider
                              name="Medios"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <v-select
                                v-model="caso.medio_id"
                                :options="mediosOptions"
                                :reduce="(label) => label.code"
                                label="label"
                                id="medio_id"
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                                <span slot="no-options">No hay Medio.</span>
                              </v-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar un medio</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Proceso" label-for="caso_process_request_id">
                            <v-select v-model="caso.caso_process_request_id" :options="processOptions" :reduce="label => label.code" label="label" id="caso_process_request_id">
                              <span slot="no-options">No hay procesos.</span>
                            </v-select>
                          </b-form-group>
                          <b-form-group v-if="caso.caso_process_request_id > 0" class="col-md-6" label="Actuación" label-for="caso_status_process_id">
                            <v-select v-model="caso.caso_status_process_id" :options="statusProcessOptions" :reduce="label => label.code" label="label" id="caso_status_process_id">
                              <span slot="no-options">No hay tipo de actuaciones.</span>
                            </v-select>
                          </b-form-group>
                        </b-row>
                      </b-col>
                      <b-col lg="12" md="12">
                        <b-row>
                          <b-form-group
                            class="col-md-6"
                            label="Titulo*"
                            label-for="case_title">
                            <b-form-input
                              v-model="caso.case_title"
                              type="text"
                              :required="true"
                            ></b-form-input>
                          </b-form-group>
                          <b-form-group
                            class="col-md-6"
                            label="Fecha de solicitud*"
                            label-for="case_title">
                            <ValidationProvider
                              name="Solicitud"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <datetime
                                class="form-control datetime-formulario"
                                type="datetime"
                                v-model="caso.fecha_solicitud" use12-hour
                                :class="errors.length > 0 ? ' is-invalid' : ''"
                              >
                              </datetime>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar una fecha</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                        </b-row>

                        <b-form-group
                          label="Descripción*"
                          label-for="textarea-decription"
                        >
                          <b-form-textarea
                            class="col-md-6"
                            id="textarea-decription"
                            v-model="caso.case_description"
                            rows="3"
                            :state="
                              caso.case_description.length <= 250 &&
                              caso.case_description.length >= 5
                            "
                            :required="true"
                          ></b-form-textarea>
                        </b-form-group>
                        <div
                          v-for="(casefile, index) in caseFiles"
                          :key="index"
                        >
                          <b-form-group>
                            <b-form-file
                              class="col-md-6"
                              v-model="casefile.file"
                              :name="`file-${index}`"
                              placeholder="Añadir archivo"
                            ></b-form-file>
                            <b-button
                              size="sm"
                              variant="danger"
                              style="margin-left: 10px;margin-top:5px;"
                              v-b-tooltip.hover
                              title="Quitar archivo"
                              @click="removeFile(index)"
                              ><em class="fa fa-times"></em
                            ></b-button>
                          </b-form-group>
                        </div>
                        <b-form-group
                          ><b-button
                            size="sm"
                            variant="success"
                            v-b-tooltip.hover
                            title="Adjuntar otro archivo"
                            @click="addFile"
                            ><em class="fa fa-plus"></em> </b-button
                        ></b-form-group>

                        <b-form-group>
                          <b-button
                            variant="primary"
                            type="submit"
                            :class="estadoBoton"
                            >{{ textoBoton }}</b-button
                          >
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </template>
                </iq-card>
              </b-col>
            </b-row>
          </form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import auth from '@/logic/auth'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
export default {
  name: 'AddCaseAbogado',
  components: {
    datetime: Datetime
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Guardar Caso',
      actividad_id: '',
      caso: {
        user_id: '',
        servicio_id: '',
        clinica_id: '',
        abogado_id: '',
        medio_id: '',
        subactividad_id: '',
        fecha_solicitud: '',
        case_title: '',
        case_description: '',
        caso_process_request_id: '',
        caso_status_process_id: ''
      },
      clientesOptions: [],
      serviciosOptions: [],
      clinicasOptions: [],
      abogadosOptions: [],
      actividadesOptions: [],
      subactividadOptions: [],
      mediosOptions: [],
      fechaSolucion: null,
      processOptions: [],
      statusProcessOptions: [],
      fechaSolucionKey: 0,
      caseFiles: [
        {
          file: null
        }
      ]
    }
  },
  computed: {
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
    this.getActividades()
    this.getProfesionals()
    this.getServicios()
    this.getUserClinicas()
    setTimeout(() => {
      this.getMediosSolicitud()
      this.fetchProcessOptions()
      this.fetchStatusProcessOptions()
    }, 500)
  },
  methods: {
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.status === 200) {
          this.clinicasOptions = res.data.clinicas
        } else {
          Vue.swal(res.data.message)
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
          this.subactividadOptions = response.data.subactividades
        })
    },
    getProfesionals () {
      axios.get('/professionals/fetch').then((response) => {
        if (this.userLogged !== undefined) {
          const esAbogado = this.userLogged.profiles[0].prof_id === 2 ? this.userLogged.user_pro_id : null
          if (esAbogado) {
            const abogadoTopList = {
              'code': this.userLogged.user_pro_id,
              'label': this.userLogged.usr_name_first + ' ' + this.userLogged.usr_lastname_first
            }
            this.abogadosOptions = response.data.professionals.filter(profesional => profesional.code !== esAbogado)
            this.abogadosOptions.unshift(abogadoTopList)
          } else {
            this.abogadosOptions = response.data.professionals
          }
        } else {
          this.abogadosOptions = response.data.professionals
        }
      })
    },
    getClientes () {
      this.caso.user_id = null
      axios.get('/clientes/fetch', { params: { clinica_id: this.caso.clinica_id } }).then((response) => {
        this.clientesOptions = response.data.clientes
      })
    },
    getMediosSolicitud () {
      axios.get('/medios-solicitud/fetch').then((response) => {
        this.mediosOptions = response.data.medios
      })
    },
    getServicios () {
      axios.get('/servicios/fetch').then((response) => {
        this.serviciosOptions = response.data.servicios
      })
    },
    getTiempoAns () {
      axios
        .get('/subactividades/getTiempoAns/' + this.caso.subactividad_id)
        .then((res) => {
          this.fechaSolucion = res.data.fechaSolucion
        })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getTiempoAns()
            this.intentos++
          }
        })
    },
    fetchProcessOptions () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerProcesosParaLista/' + this.userLogged.usr_id).then(response => {
          this.processOptions = response.data.process
          this.processOptions.unshift({ 'code': 0, 'label': 'Ninguno' })
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
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    fetchStatusProcessOptions () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/statusProcess/fetch').then(response => {
          this.statusProcessOptions = response.data.status_process
          if (this.statusProcessOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchStatusProcessOptions()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.guardarCaso()
    },
    addFile () {
      this.caseFiles.push({
        file: null
      })
    },
    removeFile (index) {
      this.caseFiles.splice(index, 1)
    },
    guardarCaso () {
      this.textoBoton = 'Guardando...'

      const data = new FormData()

      data.append('case_title', this.caso.case_title)
      data.append('case_description', this.caso.case_description)
      data.append('user_id', this.caso.user_id)
      data.append('clinica_id', this.caso.clinica_id)
      data.append('servicio_id', this.caso.servicio_id)
      data.append('profesional_id', this.caso.abogado_id)
      data.append('subactividad_id', this.caso.subactividad_id)
      data.append('medio_id', this.caso.medio_id)
      data.append('caso_process_request_id', this.caso.caso_process_request_id)
      data.append('caso_status_process_id', this.caso.caso_status_process_id)
      data.append('fecha_solicitud', this.caso.fecha_solicitud)

      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
          index++
        }
      }

      data.append('cantidad_archivos', index)

      axios.post('/casos-abogado/create', data).then((res) => {
        if (res.status === 200) {
          Vue.swal(res.data.message)
          this.$router.push({ path: `/cases/cases-show/${res.data.caso_id}` })
        } else {
          this.estadoBoton = ''
          this.textoBoton = 'Guardar Caso'
          Vue.swal(res.data.message)
        }
      })
        .catch(err => {
          this.estadoBoton = ''
          this.textoBoton = 'Guardar Caso'
          Vue.swal('Error al tratar de guardar el caso. Intente más tarde. ' + err)
        })
    }
  }
}
</script>
