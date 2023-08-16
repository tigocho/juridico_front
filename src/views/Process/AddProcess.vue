<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Registro de proceso</h4>
                <h6 class="card-title">Campos marcados con * son obligatorios</h6>
              </template>
              <template v-slot:body>
                <div class="new-process-info">
                  <b-row>
                    <b-form-group v-if="profileProcessOptions != null" class="col-md-6" label="Actuación en el proceso*" label-for="prore_profile_id">
                      <ValidationProvider name="Actuación en el proceso" rules="required" v-slot="{ errors }">
                        <v-select v-model="formData.prore_profile_id" :options="profileProcessOptions" :reduce="label => label.code" label="label" id="prore_profile_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay perfiles.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group label="Abogado Lider" class="col-md-6" label-for="profesional_id">
                    <v-select
                      v-model="formData.prore_pro_id"
                      :options="profesionalesOptions"
                      :reduce="(label) => label.code"
                      label="label"
                      id="profesional_id"
                    >
                    <span slot="no-options">No hay Abogados.</span>
                  </v-select>
                </b-form-group>
                    <b-form-group class="col-md-6" label="Número de radicado*" label-for="prore_num_radicado">
                      <ValidationProvider name="Número de radicado" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_num_radicado" @change="existeProceso" type="number" placeholder="9387183671" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Identificador de litigando*" label-for="prore_litigando_id">
                      <ValidationProvider name="Identificador de litigando" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_litigando_id" type="number" placeholder="9387183671" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha de Ingreso a Juridico*" label-for="prore_fec_ingreso_jur">
                      <ValidationProvider name="Fecha de Ingreso a Juridico" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_fec_ingreso_jur" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha Traslado Decreto 806" label-for="prore_fec_ingreso">
                      <ValidationProvider name="Fecha Traslado Decreto 806">
                        <b-form-input v-model="formData.prore_fec_ingreso" type="date"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="clinicaOptions != null" class="col-md-6" label="Clinica/IPS*" label-for="prore_defendant_clin">
                      <ValidationProvider name="Clinica/IPS" rules="required" v-slot="{ errors }">
                        <v-select v-model="formData.prore_defendant_clin" :options="clinicaOptions" :reduce="label => label.code" label="label" id="prore_profile_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay clinicas.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="epsOptions != null" class="col-md-6" label="EPS" label-for="prore_eps_id">
                      <v-select v-model="formData.prore_eps_id" :options="epsOptions" :reduce="label => label.code" label="label" id="prore_eps_id" >
                        <span slot="no-options">No hay eps.</span>
                      </v-select>
                    </b-form-group>
                    <b-form-group v-if="regimenesOptions != null" class="col-md-6" label="Régimen" label-for="prore_regimen_id">
                      <v-select v-model="formData.prore_regimen_id" :options="regimenesOptions" :reduce="label => label.code" label="label" id="prore_regimen_id" >
                        <span slot="no-options">No hay régimen.</span>
                      </v-select>
                    </b-form-group>
                    <b-form-group v-if="causasLitigioOptions != null" class="col-md-6" label="Causa del litigio" label-for="prore_causa_litigio_id">
                      <v-select v-model="formData.prore_causa_litigio_id" :options="causasLitigioOptions" @input="fetchSubCausasLitigio" :reduce="label => label.code" label="label" id="prore_causa_litigio_id" >
                        <span slot="no-options">No hay causas de litigio.</span>
                      </v-select>
                    </b-form-group>
                    <b-form-group v-if="subCausasLitigioOptions != null" class="col-md-6" label="Subcausa del litigio" label-for="prore_sub_causa_litigio_id">
                      <ValidationProvider name="Sub Causas litigios" :rules="requiredSubCausaRule" v-slot="{ errors }">
                        <v-select v-model="formData.prore_sub_causa_litigio_id" :options="subCausasLitigioOptions" :reduce="label => label.code" label="label" id="prore_sub_causa_litigio_id"  :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay sub causas de litigio.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha del Siniestro*" label-for="prore_fec_sinister">
                      <ValidationProvider name="Fecha del Siniestro" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_fec_sinister" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')">
                        </b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="years != null" class="col-md-6" label="Año de notificación" label-for="prore_year_notify">
                      <ValidationProvider name="Year de notificación" v-slot="{ errors }">
                        <v-select v-model="formData.prore_year_notify" :options="years" :reduce="label => label.code" label="label" id="prore_year_notify" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay años.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="years != null" class="col-md-6" label="Año del proceso" label-for="prore_process_year">
                      <ValidationProvider name="Year del proceso"  v-slot="{ errors }">
                        <v-select v-model="formData.prore_process_year" :options="years" :reduce="label => label.code" label="label" id="prore_process_year" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay años.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha de notificación prejudicial" label-for="prore_fec_noti_preju">
                      <ValidationProvider name="Fecha de notificación prejudicial">
                        <b-form-input v-model="formData.prore_fec_noti_preju" type="date"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha de la audiencia de conciliación prejudicial" label-for="prore_fec_audi_conci_preju">
                      <b-form-input v-model="formData.prore_fec_audi_conci_preju" type="date">
                        </b-form-input>
                      </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha aviso del siniestro" label-for="prore_fec_sinies_aviso">
                      <ValidationProvider name="Fecha de notificación prejudicial">
                        <b-form-input v-model="formData.prore_fec_sinies_aviso" type="date"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Descripción del Proceso*" label-for="prore_sinies_description">
                      <ValidationProvider name="Descripción del Proceso" rules="required" v-slot="{ errors }">
                      <vue-editor v-model="formData.prore_sinies_description" :editorToolbar="customToolbar" :class="(errors.length > 0 ? ' is-invalid' : '')"></vue-editor>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Patología" label-for="prore_pathology">
                      <ValidationProvider name="Patología" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_pathology" type="text" placeholder="Patología..." :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha de recibo de notificación IPS" label-for="prore_fec_recibo_notify">
                      <ValidationProvider name="Fecha de notificación prejudicial">
                        <b-form-input v-model="formData.prore_fec_recibo_notify" type="date"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Colaborador de IPS que recibe notificación" label-for="prore_responsable">
                      <ValidationProvider name="Colaborador de IPS que recibe notificación" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_colaborador_ips" type="text" placeholder="Nombre completo colaborador" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha de Ingreso a Clínica*" label-for="prore_fec_ingreso_cli">
                      <ValidationProvider name="Fecha de Ingreso a Clínica" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_fec_ingreso_cli" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')">
                        </b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="citiesOptions != null" class="col-md-6" label="Ciudad*" label-for="prore_city_id">
                      <ValidationProvider name="Ciudad" rules="required" v-slot="{ errors }">
                        <v-select v-model="formData.prore_city_id" :options="citiesOptions" :reduce="label => label.code" label="label" id="prore_city_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay ciudades.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="especialidadesOptions != null" class="col-md-6" label="Especialidad" label-for="prore_propse_id">
                      <ValidationProvider name="Especialidad" v-slot="{ errors }">
                        <v-select v-model="formData.prore_propse_id" :options="especialidadesOptions" :reduce="label => label.code" label="label" id="prore_city_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay ciudades.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="statusProcessOptions != null" class="col-md-6" label="Estado del proceso*" label-for="prore_status_process_id">
                      <ValidationProvider name="Estado del proceso" rules="required" v-slot="{ errors }">
                        <v-select v-model="formData.prore_status_process_id" :options="statusProcessOptions" :reduce="label => label.code" label="label" id="prore_status_process_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay estados.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="risksOptions != null" class="col-md-6" label="Riesgo NIIF" label-for="prore_risk_id">
                      <ValidationProvider name="Riesgo NIIF" v-slot="{ errors }">
                        <v-select v-model="formData.prore_risk_id" :options="risksOptions" :reduce="label => label.code" label="label" id="prore_risk_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay riesgos.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="typeProcessOptions != null" class="col-md-6" label="Tipo de Proceso*" label-for="prore_typro_id">
                      <ValidationProvider name="Tipo de Proceso" rules="required" v-slot="{ errors }">
                        <v-select v-model="formData.prore_typro_id" :options="typeProcessOptions" :reduce="label => label.code" label="label" id="prore_typro_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay tipo de procesos.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group v-if="typeProcessOptions != null" class="col-md-6" label="Juzgado" label-for="prore_court_id">
                      <ValidationProvider name="Juzgado" v-slot="{ errors }">
                        <v-select v-model="formData.prore_court_id" :options="courtsOptions" :reduce="label => label.code" label="label" id="prore_court_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay juzgados.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                      <b-card-text class="texto-tipo-boton text-dark" v-b-modal.modal-crear-juzagado>Crear juzgado</b-card-text>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Provisiones constituidas" label-for="prore_prov_constituidas">
                      <ValidationProvider name="Provisiones constituidas" v-slot="{ errors }">
                        <b-form-input v-model="formData.prore_prov_constituidas" type="number" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-modal
                      id="modal-crear-juzagado"
                      ref="modal"
                      title="Agregar juzgado"
                      hide-footer
                    >
                      <form ref="form" @submit.stop.prevent="handleSubmit">
                        <b-form-group
                          label="Nombre del juzgado"
                          label-for="name-input"
                        >
                          <b-form-input
                            id="name-input"
                            v-model="nuevo_court.name"
                          ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Teléfono del juzgado">
                          <b-form-input v-model="nuevo_court.telefono" type="text" placeholder="ej: 3015456561"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Correo del juzgado">
                          <b-form-input v-model="nuevo_court.email" type="email" placeholder="info@example.com"></b-form-input>
                        </b-form-group>
                        <div class="text-right pt-1">
                          <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-crear-juzagado')">Cancelar</b-button>
                          <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="handleOk">{{ textoGuardarModal }}</b-button>
                        </div>
                      </form>
                    </b-modal>
                  </b-row>
                <b-button variant="primary" type="submit" :class="estadoBoton">{{ textoBoton }}</b-button>
              </div>
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
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  name: 'AddUser',
  mounted () {
    xray.index()
    this.fetchProfileProcessOptions()
    this.fetchOptionsClinicas()
    this.getProfesionals()
    setTimeout(() => {
      this.fetchEstadosProceso()
      this.fetchEspecialidades()
      this.fetchTypeProcess()
      setTimeout(() => {
        this.fetchCourts()
        this.fetchProfiles()
        this.fetchEps()
        this.fetchRegimenes()
        setTimeout(() => {
          this.fetchCity()
          this.fetchRisks()
          this.fetchCausasLitigio()
          this.barraCargando()
        }, 500)
      }, 500)
    }, 500)
  },
  data () {
    return {
      customToolbar: [['bold', 'italic', 'underline']],
      textoBoton: 'Guardar',
      estadoBoton: '',
      botonGuardarModal: '',
      textoGuardarModal: 'Guardar',
      year: null,
      progress_total: 4,
      max: 100,
      loading: true,
      errored: false,
      animate: true,
      nuevoLink: {
        link_name: '',
        link_url: '',
        link_user_id: ''
      },
      nuevoImplicated: {
        imp_tipo_identificacion: '',
        imp_identificacion: '',
        imp_nombres: '',
        imp_apellidos: '',
        imp_direccion: '',
        imp_edad: '',
        imp_rango_edad: '',
        imp_genero_id: '',
        imp_telefonos: '',
        imp_emails: '',
        imp_profile_id: ''
      },
      formData: {
        prore_profile_id: '',
        prore_fec_ingreso: '',
        prore_colaborador_ips: '',
        prore_fec_sinister: '',
        prore_defendant_clin: '',
        prore_eps_id: '',
        prore_year_notify: '',
        prore_process_year: '',
        prore_propse_id: '',
        prore_court_id: '',
        prore_typro_id: '',
        prore_litigando_id: '',
        prore_city_id: '',
        prore_num_radicado: '',
        prore_pathology: '',
        prore_risk_id: '',
        prore_fec_noti_preju: '',
        prore_fec_audi_conci_preju: '',
        prore_fec_sinies_aviso: '',
        prore_fec_recibo_notify: '',
        prore_fec_ingreso_jur: '',
        prore_fec_ingreso_cli: '',
        prore_sinies_description: '',
        prore_status_process_id: '',
        prore_user_id: '',
        prore_prov_constituidas: '',
        prore_regimen_id: '',
        prore_causa_litigio_id: '',
        prore_sub_causa_litigio_id: ''
      },
      process: [],
      clinicaOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      especialidadesOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      typeProcessOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      courtsOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      risksOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      nuevo_court: {
        name: '',
        telefono: '',
        email: ''
      },
      citiesOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      profilesOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      statusProcessOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      profileProcessOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }],
      intentos: 0,
      profesionalesOptions: [],
      errores: '',
      epsOptions: [],
      regimenesOptions: [],
      causasLitigioOptions: [],
      subCausasLitigioOptions: [],
      epsOptionEmpty: {
        'code': null,
        'label': 'Sin EPS'
      },
      regimenOptionEmpty: {
        'code': null,
        'label': 'Sin régimen'
      },
      causasLitigioOptionEmpty: {
        'code': null,
        'label': 'Sin causas'
      },
      subCausasLitigioOptionEmpty: {
        'code': null,
        'label': 'Sin subcausas'
      }
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
    years () {
      const year = new Date().getFullYear()
      let length = (year - 1995)
      let yearsOptions = []
      for (let index = 0; index < length; index++) {
        yearsOptions.push({ 'code': (2000 + index), 'label': (2000 + index) })
      }
      return yearsOptions
    },
    requiredSubCausaRule () {
      if (this.formData.prore_causa_litigio_id) {
        return {
          required: value => !!value || 'Debe seleccionar una opción'
        }
      } else {
        return {} // No aplicar ninguna validación si cliente_id es nulo
      }
    }
  },
  methods: {
    ejecutarConsultas () {
      setTimeout(() => {
        this.fetchProfileProcessOptions()
        this.fetchOptionsClinicas()
        this.fetchEps()
        this.fetchRegimenes()
        setTimeout(() => {
          this.fetchEstadosProceso()
          this.fetchEspecialidades()
          this.fetchTypeProcess()
          setTimeout(() => {
            this.fetchCourts()
            this.fetchProfiles()
            setTimeout(() => {
              this.fetchRisks()
              this.barraCargando()
            }, 500)
          }, 500)
        }, 500)
      }, 500)
    },
    fetchProfileProcessOptions () {
      axios.get('/profiles/fetch-profiles-process-requests').then(response => {
        this.profileProcessOptions = response.data.profiles
        if (this.profileProcessOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchProfileProcessOptions()
          }
          this.intentos++
        })
    },
    fetchEstadosProceso () {
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
            this.fetchEstadosProceso()
            this.intentos++
          }
        })
    },
    fetchEspecialidades () {
      axios.get('/especialidades/fetch').then(response => {
        this.especialidadesOptions = response.data.especialidades
        if (this.especialidadesOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchEspecialidades()
            this.intentos++
          }
        })
    },
    fetchTypeProcess () {
      axios.get('/typeProcess/fetch').then(response => {
        this.typeProcessOptions = response.data.type_process
        if (this.typeProcessOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchTypeProcess()
            this.intentos++
          }
        })
    },
    fetchCity () {
      axios.get('/cities/fetch').then(response => {
        this.citiesOptions = response.data.cities
        if (this.citiesOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
    },
    fetchCourts () {
      axios.get('/courts/fetch').then(response => {
        this.courtsOptions = response.data.courts
        if (this.courtsOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchCourts()
            this.intentos++
          }
        })
    },
    fetchRisks () {
      axios.get('/risks/fetch').then(response => {
        this.risksOptions = response.data.risks
        if (this.risksOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchRisks()
            this.intentos++
          }
        })
    },
    fetchProfiles () {
      // solo trae los perfiles que no tengan que ver con la plataforma
      axios.get('/profiles/fetchExterns').then(response => {
        this.profilesOptions = response.data.profiles
        if (this.profilesOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchProfiles()
            this.intentos++
          }
        })
    },
    onSubmit: function () {
      this.registrarProceso()
    },
    registrarProceso () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.formData.prore_user_id = this.userLogged.usr_id
      }
      this.textoBoton = 'Guardando...'
      this.estadoBoton = 'disabled'
      axios.post('/process/store', { formulario: this.formData }).then(res => {
        this.textoBoton = 'Guardar'
        this.estadoBoton = ''
        if (res.data.status_code === 200) {
          Vue.swal('Proceso agregado correctamente')
          let editar = false
          this.$router.push({ path: `/process/process-show/${res.data.prore_id}/${editar}` })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    fetchOptionsClinicas () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/clinicas/' + this.userLogged.usr_id).then(response => {
          this.clinicaOptions = response.data.clinicas
          if (this.clinicaOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchOptionsClinicas()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      if (this.nuevo_court.name === '' ||
      this.nuevo_court.name === null ||
      this.nuevo_court.telefono === '' ||
      this.nuevo_court.telefono === null) {
        Vue.swal('Por favor complete los datos.')
      } else {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando'
        this.handleSubmit()
      }
    },
    handleSubmit () {
      axios.post('/courts/store', this.nuevo_court).then(res => {
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-crear-juzagado')
        })
        if (res.data.status_code === 200) {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          this.nuevo_court.name = ''
          this.nuevo_court.telefono = ''
          this.nuevo_court.email = ''
          this.formData.prore_court_id = res.data.court_id
          Vue.swal('Juzgado agregado correctamente')
          this.fetchCourts()
        } else {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Datos no validos')
        }
      })
    },
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    existeProceso () {
      axios.get('/process/getprocess-radicado/' + this.formData.prore_num_radicado).then(response => {
        if (response.status === 200) {
          Vue.swal({
            icon: 'info',
            title: 'El proceso ya existe ',
            text: 'Ya hay registrado un proceso con este número de radicado, ¿Deseas verlo?',
            showCancelButton: true,
            confirmButtonText: 'Sí, quiero verlo!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push({ path: `/process/process-show/${response.data.proceso.prore_id}/${false}` })
            }
          })
        }
      })
    },
    getProfesionals () {
      axios.get('/professionals/fetch').then((response) => {
        this.profesionalesOptions = response.data.professionals
        if (this.profesionalesOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchProfiles()
            this.intentos++
          }
        })
    },
    fetchEps () {
      axios.get('/eps/fetch').then((response) => {
        this.epsOptions = response.data.eps
        if (this.epsOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
        this.epsOptions.push(this.epsOptionEmpty)
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchEps()
            this.intentos++
          }
        })
    },
    fetchRegimenes () {
      axios.get('/regimenes/fetch').then((response) => {
        this.regimenesOptions = response.data.regimenes
        if (this.regimenesOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
        this.regimenesOptions.push(this.regimenOptionEmpty)
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchRegimenes()
            this.intentos++
          }
        })
    },
    fetchCausasLitigio () {
      axios.get('/causas_litigio/fetch').then((response) => {
        this.causasLitigioOptions = response.data.causas_litigio
        if (this.causasLitigioOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
        this.causasLitigioOptions.push(this.causasLitigioOptionEmpty)
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchCausasLitigio()
            this.intentos++
          }
        })
    },
    fetchSubCausasLitigio () {
      this.formData.prore_sub_causa_litigio_id = ''
      axios.get('/sub_causas_litigio/fetch/' + this.formData.prore_causa_litigio_id).then((response) => {
        this.subCausasLitigioOptions = response.data.sub_causas_litigio
        if (this.subCausasLitigioOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
        this.subCausasLitigioOptions.push(this.subCausasLitigioOptionEmpty)
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchSubCausasLitigio()
            this.intentos++
          }
        })
    }
  }
}
</script>
