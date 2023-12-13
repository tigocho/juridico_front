<template>
  <b-container fluid>
    <b-row>
      <!-- Sección modal crear nuevo cliente-->
      <b-modal
        id="modal-crear-cliente"
        ref="modal"
        title="Crear cliente/accionante"
        hide-footer
      >
        <formulario-crear-cliente
          @cerrar-modal-crear-cliente="cerrarModalCrearCliente"
          @cliente-creado="getClientes"
        >
        </formulario-crear-cliente>
      </b-modal>
      <!-- FIN Sección modal crear nuevo cliente-->
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <form class="mt-10" @submit.prevent="handleSubmit(onSubmit)">
            <template>
              <b-row
                class="justify-content-center text-center align-items-center"
              >
                <b-col lg="11">
                  <iq-card>
                    <template v-slot:body>
                      <b-row>
                        <b-col lg="12">
                          <h4 class="px0 card-title text-center">Actualizar Tutela</h4>
                        </b-col>
                        <b-col lg="12">
                          <p>Campos marcados con * son obligatorios</p>
                        </b-col>
                        <b-col lg="12">
                          <b-row>
                            <b-form-group
                              class="col-md-6"
                              label="Asignado a *"
                              label-for="tut_profesional_id"
                            >
                              <ValidationProvider
                                name="abogado"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_profesional_id"
                                  :options="abogadosOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_profesional_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay Abogados.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un abogado</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Cliente*"
                              label-for="clinica_id"
                            >
                              <ValidationProvider
                                name="clinicas"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_clinica_id"
                                  :options="clinicasOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_clinica_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                  @input="getClientes($event)"
                                >
                                  <span slot="no-options">No hay clinicas.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una clinica</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Solicitante*"
                              label-for="user_id"
                            >
                              <ValidationProvider
                                name="Solicitante"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_usuario_solicitante_id"
                                  :options="clientesOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_usuario_solicitante_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay Clientes.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un cliente</span>
                                </div>
                              </ValidationProvider>
                              <b-card-text class="texto-tipo-boton text-dark" v-b-modal.modal-crear-cliente>Crear nuevo cliente/accionante</b-card-text>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Fecha de radicación*"
                              label-for="tutela_fecha_radicacion"
                            >
                              <ValidationProvider
                                name="Fecha Radicación"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <datetime
                                  class="form-control datetime-formulario"
                                  type="date"
                                  v-model="tutela.tut_fecha_radicacion"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                </datetime>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una fecha</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Fecha de solicitud*"
                              label-for="tutela_fecha_solicitud"
                            >
                              <ValidationProvider
                                name="Fecha de Solicitud"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <datetime
                                  class="form-control datetime-formulario"
                                  type="datetime"
                                  v-model="tutela.tut_fecha_solicitud" user12-hour
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                </datetime>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una fecha y hora</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-3"
                              label="Termino para contestar*"
                              label-for="tut_termino_contestar_option"
                            >
                              <ValidationProvider
                                name="Termino para contestar opción"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_termino_contestar_option"
                                  :options="terminosContestarOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_termino_contestar_option"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay terminos.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un termino para contestar</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-3"
                              label="Termino para contestar*"
                              label-for="tut_termino_contestar"
                            >
                              <ValidationProvider
                                name="Termino para contestar"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <b-form-input
                                  v-model="tutela.tut_termino_contestar"
                                  type="number"
                                  placeholder="ej: 4"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                </b-form-input>
                                <div class="invalid-feedback">
                                  <span>Debe de escribir un número de días u horas</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
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
                                  v-model="tutela.tut_actividad_id"
                                  :options="actividadesTutelaOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_actividad_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay actividades.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar una actividad</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Tipo de litigio (trámite)*"
                              label-for="tut_tipo_litigio_id"
                            >
                              <ValidationProvider
                                name="Tipo de litigio (trámite)"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_tipo_litigio_id"
                                  :options="tiposLitigioOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_tipo_litigio_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay tipos de litigio.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un tipo de litigio</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Accionante*"
                              label-for="tut_accionante_id"
                            >
                              <ValidationProvider
                                name="Accionante"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_accionante_id"
                                  :options="clientesExternosOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_accionante_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay Accionantes.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un accionante</span>
                                </div>
                              </ValidationProvider>
                              <b-card-text class="texto-tipo-boton text-dark" v-b-modal.modal-crear-cliente>Crear nuevo cliente/accionante</b-card-text>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Tipo de servicio*"
                              label-for="tut_servicio_id"
                            >
                              <ValidationProvider
                                name="Tipo de Servicio"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_servicio_id"
                                  :options="serviciosOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_servicio_id"
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
                              label="Medio Solicitud*"
                              label-for="tut_medio_solicitud_id"
                            >
                              <ValidationProvider
                                name="Medio de solicitud"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_medio_solicitud_id"
                                  :options="mediosOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_medio_solicitud_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay medio de solicitud.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un medio de solicitud</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Gestión realizada*"
                              label-for="tut_tipo_gestion_id"
                            >
                              <ValidationProvider
                                name="Gestión realizada"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_tipo_gestion_id"
                                  :options="tiposGestionOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_tipo_gestion_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay tipos de gestión.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un tipo de gestión</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              class="col-md-6"
                              label="Estado de la tutela*"
                              label-for="tut_estado_tutela_id"
                            >
                              <ValidationProvider
                                name="Estado de la tutela"
                                rules="required"
                                v-slot="{ errors }"
                              >
                                <v-select
                                  v-model="tutela.tut_estado_tutela_id"
                                  :options="estadosTutelaOptions"
                                  :reduce="(label) => label.code"
                                  label="label"
                                  id="tut_estado_tutela_id"
                                  :class="errors.length > 0 ? ' is-invalid' : ''"
                                >
                                  <span slot="no-options">No hay estados.</span>
                                </v-select>
                                <div class="invalid-feedback">
                                  <span>Debe de seleccionar un estado</span>
                                </div>
                              </ValidationProvider>
                            </b-form-group>
                            <b-form-group
                              label="Descripción de la tutela*"
                              label-for="textarea-decription"
                              class="col-md-12"
                            >
                              <b-form-textarea
                                class="col-md-12"
                                id="textarea-decription"
                                v-model="tutela.tut_descripcion"
                                rows="3"
                                :state="
                                  tutela.tut_descripcion.length <= 4000 &&
                                  tutela.tut_descripcion.length >= 5
                                "
                                :required="true"
                              ></b-form-textarea>
                            </b-form-group>
                            <b-form-group class="col-md-12">
                            <b-button
                              variant="primary"
                              type="submit"
                              :class="estadoBoton"
                              >{{ textoBoton }}</b-button
                            >
                            </b-form-group>
                          </b-row>
                        </b-col>
                      </b-row>
                    </template>
                  </iq-card>
                </b-col>
              </b-row>
            </template>
          </form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'
import { Datetime } from 'vue-datetime'
import FormularioCrearCliente from './../../User/components/FormularioCrearCliente'
export default {
  name: 'EdicionTutela',
  props: {
    tutela: Object
  },
  components: {
    datetime: Datetime,
    FormularioCrearCliente
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Actualizar Tutela',
      etapaProcesal: {
        tet_etapa_procesal_id: '',
        tet_tipo_peticion_id: '',
        tet_descripcion: '',
        tet_tiempo_invertido: '',
        tet_tiempo_invertido_option: ''
      },
      clinicasOptions: [],
      clientesOptions: [],
      actividadesTutelaOptions: [],
      tiposLitigioOptions: [],
      clientesExternosOptions: [],
      serviciosOptions: [],
      tiposGestionOptions: [],
      abogadosOptions: [],
      estadosTutelaOptions: [],
      mediosOptions: [],
      tiposPeticionOptions: [],
      etapasProcesalOptions: [],
      terminosContestarOptions: [
        { label: 'Días', code: 1 },
        { label: 'Horas', code: 2 }
      ],
      tiposTiempoInvertidoOption: [
        { label: 'No', code: 0 },
        { label: 'Días', code: 1 },
        { label: 'Horas', code: 2 }
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
    this.organizarInformacion()
    xray.index()
    this.getUserClinicas()
    this.getActividades()
    this.getTiposLitigio()
    this.getClientesExternos()
    setTimeout(() => {
      this.getServicios()
      this.getTiposGestion()
      this.getProfesionals()
      this.getMediosSolicitud()
      this.getEstadosTutela()
      this.getEtapasProcesal()
      this.getTiposPeticion()
    }, 500)
  },
  methods: {
    organizarInformacion () {
      this.tutela.tut_termino_contestar_option = 2
    },
    getUserClinicas (wasAutomatic) {
      axios.get('/clinicas/' + this.userLogged.usr_id, { params: { clinica_id: this.tutela.tut_clinica_id } }).then((res) => {
        this.clinicasOptions = res.data.clinicas
        this.getClientes(wasAutomatic)
      })
        .catch((err) => {
          this.errores = err
        })
    },
    getClientes (wasAutomatic) {
      if (wasAutomatic !== undefined) {
        this.tutela.tut_usuario_solicitante_id = null
      }
      axios.get('/clientes/fetch', { params: { clinica_id: this.tutela.tut_clinica_id } }).then((response) => {
        this.clientesOptions = response.data.clientes
      })
    },
    getActividades () {
      axios.get('/actividaes-tutela/fetch').then((response) => {
        this.actividadesTutelaOptions = response.data.actividadesTutela
      })
    },
    getTiposLitigio () {
      axios.get('/tipos-litigio/fetch').then((response) => {
        this.tiposLitigioOptions = response.data.tiposLitigio
      })
    },
    getClientesExternos () {
      axios.get('/clientes/obtener-clientes-externos').then((response) => {
        this.clientesExternosOptions = response.data.clientesExternos
      })
    },
    getServicios () {
      axios.get('/servicios/fetch').then((response) => {
        this.serviciosOptions = response.data.servicios
      })
    },
    getTiposGestion () {
      axios.get('/tipos-gestion/fetch').then((response) => {
        this.tiposGestionOptions = response.data.tiposGestion
      })
    },
    getEstadosTutela () {
      axios.get('/estados-tutela/fetch').then((response) => {
        this.estadosTutelaOptions = response.data.estadosTutela
      })
    },
    getMediosSolicitud () {
      axios.get('/medios-solicitud/fetch').then((response) => {
        this.mediosOptions = response.data.medios
      })
    },
    getEtapasProcesal () {
      axios.get('/etapas-procesal/fetch').then((response) => {
        this.etapasProcesalOptions = response.data.etapasProcesal
      })
    },
    getTiposPeticion () {
      axios.get('/tipos-peticion/fetch').then((response) => {
        this.tiposPeticionOptions = response.data.tiposPeticion
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
    cerrarModalCrearCliente () {
      this.$refs.modal.hide()
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.actualizarTutela()
    },
    actualizarTutela () {
      const tutelaDatosActualizar = this.organizarDatosTutela(this.tutela)
      this.textoBoton = 'Actualizando...'
      axios.put('/tutelas/actualizar/' + this.tutela.tut_id, { tutela: tutelaDatosActualizar }).then((res) => {
        this.estadoBoton = ''
        this.textoBoton = 'Guardar tutela'
        if (res.status >= 200) {
          Vue.swal('Todo salió bien', res.data.mensaje, 'success')
          this.$emit('reloadFunciont')
        } else {
          Vue.swal('Ups, ocurrió un error', res.data.mensaje, 'error')
        }
      })
        .catch(err => {
          this.estadoBoton = ''
          this.textoBoton = 'Guardar Caso'
          Vue.swal('Ups, ocurrió un error', 'Error al tratar de guardar el caso. Intente más tarde. ' + err, 'error')
        })
    },
    organizarDatosTutela (tutela) {
      const tutelaDatosActualizarTemp = {}
      tutelaDatosActualizarTemp.tut_profesional_id = tutela.tut_profesional_id
      tutelaDatosActualizarTemp.tut_clinica_id = tutela.tut_clinica_id
      tutelaDatosActualizarTemp.tut_usuario_solicitante_id = tutela.tut_usuario_solicitante_id
      tutelaDatosActualizarTemp.tut_fecha_radicacion = tutela.tut_fecha_radicacion
      tutelaDatosActualizarTemp.tut_fecha_solicitud = tutela.tut_fecha_solicitud
      tutelaDatosActualizarTemp.tut_termino_contestar_option = tutela.tut_termino_contestar_option
      tutelaDatosActualizarTemp.tut_termino_contestar = tutela.tut_termino_contestar
      tutelaDatosActualizarTemp.tut_actividad_id = tutela.tut_actividad_id
      tutelaDatosActualizarTemp.tut_tipo_litigio_id = tutela.tut_tipo_litigio_id
      tutelaDatosActualizarTemp.tut_accionante_id = tutela.tut_accionante_id
      tutelaDatosActualizarTemp.tut_servicio_id = tutela.tut_servicio_id
      tutelaDatosActualizarTemp.tut_medio_solicitud_id = tutela.tut_medio_solicitud_id
      tutelaDatosActualizarTemp.tut_tipo_gestion_id = tutela.tut_tipo_gestion_id
      tutelaDatosActualizarTemp.tut_estado_tutela_id = tutela.tut_estado_tutela_id
      tutelaDatosActualizarTemp.tut_descripcion = tutela.tut_descripcion
      return tutelaDatosActualizarTemp
    }
  }
}
</script>
