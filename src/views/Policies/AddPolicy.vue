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
                <h4 class="card-title">Creación de Póliza</h4>
              </template>
              <template v-slot:body>
                <div class="new-poliza-info">
                  <b-row>
                    <b-form-group class="col-md-6" label="Aseguradora*" label-for="pol_ase_id">
                      <ValidationProvider name="Aseguradora" rules="required" v-slot="{ errors }">
                        <v-select v-model="poliza.pol_ase_id" :options="aseguradoraOptions" :reduce="label => label.code" label="label" id="pol_ase_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay aseguradoras.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Clinica a quien pertenece la póliza*" label-for="usr_role_id">
                      <ValidationProvider name="Clínica" rules="required" v-slot="{ errors }">
                        <v-select v-model="poliza.pol_cli_id" :options="clinicaOptions" :reduce="label => label.code" id="pol_ase_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <span slot="no-options">No hay Pabellones.</span>
                        </v-select>
                        <div class="invalid-feedback">
                          <span>Debe de seleccionar una opción</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Número de poliza*" label-for="pol_total_asegurado">
                      <ValidationProvider name="Número de poliza" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="poliza.pol_numero" type="text" placeholder="9387183671" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha inicio de vigencia de poliza*" label-for="pol_fecha_inicio">
                      <ValidationProvider name="Fecha inicio de vigencia de poliza" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="poliza.pol_fecha_inicio" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Fecha fin de vigencia de poliza*" label-for="pol_fecha_fin">
                      <ValidationProvider name="Fecha inicio de vigencia de poliza" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="poliza.pol_fecha_fin" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Total asegurado*" label-for="pol_total_asegurado">
                      <ValidationProvider name="Total Asegurado" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="poliza.pol_total_asegurado" type="number" placeholder="EJ: 10000000" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Cobertura actual*" label-for="pol_cobertura_actual">
                      <ValidationProvider name="Cobertual Actual" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="poliza.pol_cobertura_actual" type="number" placeholder="EJ: 5000000" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Deducible(%)" label-for="pol_deducible">
                      <ValidationProvider name="Deducible" rules="max_value: 100" v-slot="{ errors }">
                        <div class="input-group">
                          <b-form-input v-model="poliza.pol_deducible" type="number" placeholder="EJ: 10" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroupPrepend">%</span>
                          </div>
                          <div class="invalid-feedback">
                            <span>El deducible no puede ser mayor a 100%</span>
                          </div>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Deducible Mínimo" label-for="pol_deducible_minimo">
                      <b-form-input v-model="poliza.pol_deducible_minimo" type="number" placeholder="EJ: 100'000.000" ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Provisiones Constituidas*" label-for="pol_provisiones">
                      <ValidationProvider name="Proivisiones Constituidas" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="poliza.pol_provisiones" type="number" placeholder="EJ: 5000000" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Por favor verifique la información</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" ref="addProcess" label-for="exampleFormControlFile1" label="Subir documento de póliza">
                      <b-form-file id="input-file-import" name="file_import" ref="import_file" @change="onFileChange"></b-form-file>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Estado de la poliza" label-for="pol_estado">
                      <ValidationProvider name="Estado de la poliza" rules="required" v-slot="{ errors }">
                        <template v-for="(item,index) in estadoPoliza">
                          <b-form-radio inline v-model="poliza.pol_estado" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled" :class="(errors.length > 0 ? ' is-invalid' : '')">{{ item.label }}</b-form-radio>
                        </template>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
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

export default {
  name: 'AddUser',
  mounted () {
    xray.index()
    this.fetchClinicaOptions()
    this.fetchAseguradoraOptions()
  },
  data () {
    return {
      import_file: '',
      estadoBoton: '',
      textoBoton: 'Crear Poliza',
      poliza: {
        pol_ase_id: '',
        pol_cli_id: '',
        pol_numero: '',
        pol_fecha_inicio: '',
        pol_fecha_fin: '',
        pol_total_asegurado: '',
        pol_cobertura_actual: '',
        pol_deducible: '',
        pol_deducible_minimo: '',
        pol_provisiones: '',
        pol_url_pdf: '',
        pol_estado: 1,
        pol_user_id: ''
      },
      aseguradoraOptions: [],
      clinicaOptions: [],
      estadoPoliza: [
        {
          name: 'activa',
          label: 'Activa',
          value: 1,
          disabled: false
        },
        {
          name: 'inactiva',
          label: 'Inactiva',
          value: 0,
          disabled: false
        }
      ],
      users: [],
      intentos: 0,
      errores: []
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
  methods: {
    onFileChange (e) {
      this.import_file = e.target.files[0]
    },
    fetchClinicaOptions () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/clinicas/obtener-clinicas/' + this.userLogged.usr_id).then(response => {
          this.clinicaOptions = response.data.clinicas
          if (this.clinicaOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
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
    fetchAseguradoraOptions () {
      axios.get('/aseguradoras/fetch-aseguradoras').then(response => {
        this.aseguradoraOptions = response.data.aseguradoras
        if (this.aseguradoraOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchAseguradoraOptions()
            this.intentos++
          }
        })
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.addPoliza()
    },
    addPoliza () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.poliza.pol_user_id = this.userLogged.usr_id
        let formData = new FormData()
        formData.append('import_file', this.import_file)
        formData.append('pol_ase_id', this.poliza.pol_ase_id)
        formData.append('pol_cli_id', this.poliza.pol_cli_id)
        formData.append('pol_numero', this.poliza.pol_numero)
        formData.append('pol_fecha_inicio', this.poliza.pol_fecha_inicio)
        formData.append('pol_fecha_fin', this.poliza.pol_fecha_fin)
        formData.append('pol_total_asegurado', this.poliza.pol_total_asegurado)
        formData.append('pol_cobertura_actual', this.poliza.pol_cobertura_actual)
        formData.append('pol_deducible', this.poliza.pol_deducible)
        formData.append('pol_deducible_minimo', this.poliza.pol_deducible_minimo)
        formData.append('pol_provisiones', this.poliza.pol_provisiones)
        formData.append('pol_estado', this.poliza.pol_estado)
        formData.append('pol_user_id', this.poliza.pol_user_id)
        this.textoBoton = 'Creando Poliza...'
        axios.post('/policy/registrar-poliza', formData).then(res => {
          this.textoBoton = 'Crear Poliza'
          this.estadoBoton = ''
          if (res.data.status_code === 200) {
            Vue.swal(res.data.message)
            var editar = false
            this.$router.push({ path: `/policies/policy-show/${res.data.pol_id}/${editar}` })
          } else if (res.data.status_code === 401) {
            Vue.swal(res.data.message)
          } else {
            Vue.swal('Datos no validos. ' + res.data.message)
          }
        })
          .catch((err) => {
            this.textoBoton = 'Crear Poliza'
            this.estadoBoton = ''
            Vue.swal('Algo salio mal ' + err)
          })
      } else {
        Vue.swal('Por favor cierra sesión y vuelve a ingresar')
      }
    }
  }
}
</script>
