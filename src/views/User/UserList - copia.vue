<template>
  <b-container fluid>
    <div>
      <iq-card>
        <template v-slot:headerTitle>
          <h4 class="card-title">Usuarios</h4>
        </template>
        <template v-slot:body>
          <b-table :items="usuarios" :fields="columns" striped responsive>
            <template v-slot:cell(usr_name_first)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.usr_name_first
              }}</span>
              <input
                type="text"
                v-model="data.item.usr_name_first"
                v-else
                class="form-control"
              />
            </template>
            <template v-slot:cell(usr_lastname_first)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.usr_lastname_first
              }}</span>
              <input
                type="text"
                v-model="data.item.usr_lastname_first"
                v-else
                class="form-control"
              />
            </template>
            <template v-slot:cell(pro_identificacion)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.pro_identificacion
              }}</span>
              <input
                type="text"
                v-model="data.item.pro_identificacion"
                v-else
                class="form-control"
              />
            </template>
            <template v-slot:cell(usr_email)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.usr_email
              }}</span>
              <input
                type="text"
                v-model="data.item.usr_email"
                v-else
                class="form-control"
              />
            </template>
            <template v-slot:cell(profile_name)="data">
              <span v-if="data.item.editable!=0">{{
                data.item.profile_name
              }}</span>
            </template>
            <template #cell(show_details)="row">
              <b-button v-b-toggle="'profesional-' + row.item.pro_id" :class="esAbogado(row.item.profile_id) ? '' : 'disabled'" size="sm" @click="obtenerProcesos(row.item.pro_id)" class="mr-2"> {{ detailsShowing }} Procesos
              </b-button>
              <b-button size="sm" variant="primary" @click="editarUsuario(row.item.user_id)">
                Editar
              </b-button>
            </template>
          </b-table>
        </template>
        <template >
          <b-collapse v-for="(usuario, index) in usuarios" :key="index" v-bind:id="'profesional-' + usuario.pro_id">
            <b-card v-for="proceso in procesos" :key="proceso.prore_id">
              <b-card-text><b>Procesos Juridicos Asignados a {{ usuario.usr_name_first }} {{ usuario.usr_lastname_first }}:</b></b-card-text>
              <!--<b-row  class="col-md-12">-->
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="my-0"><b>Etapa procesal:</b> {{ proceso.estado_proceso }} </b-card-text>
                </b-row>
                <hr>
                <b>Información del proceso:</b>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Ciudad: </b>{{ proceso.city_name }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Fecha de ingreso: </b>{{ proceso.prore_fec_ingres }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Clinica: </b>{{ proceso.cli_name }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Fecha del siniestro: </b>{{ proceso.prore_fec_sinister }}</b-card-text>
                </b-row>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Fecha aviso:</b> {{ proceso.prore_fec_sinies_aviso }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Fecha de recibo de notificación IPS:</b> {{ proceso.prore_fec_recibo_notify }}</b-card-text>
                  <b-card-text class="px-1 my-0"><b>Colaborador de IPS que recibe notificación:</b> {{ proceso.prore_colaborador_ips }}</b-card-text>
                </b-row>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Año de notificación: </b>{{ proceso.prore_year_notify }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Fecha notificación prejudicial: </b>{{ proceso.prore_fec_noti_preju }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Fecha notificación prejudicial:</b> {{ proceso.prore_fec_audi_conci_preju }}</b-card-text>
                </b-row>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Descripción del siniestro: </b>{{ proceso.prore_sinies_description }}</b-card-text>
                </b-row>
                <hr>
                <b>Información Juridica</b>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>ID Litigando:</b> {{ proceso.prore_litigando_id }}</b-card-text>
                  <b-card-text class="px-1 my-0"><b>Fecha de Ingreso a Juridico:</b> {{ proceso.prore_fec_ingreso_jur }}</b-card-text>
                </b-row>
                <hr>
                <b>Información del Paciente</b>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Primer Nombre: </b>{{ proceso.prore_pac_name_first }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Segundo Nombre: </b>{{ proceso.prore_pac_name_secdon }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Primer Apellido: </b>{{ proceso.prore_pac_lastname_first }}</b-card-text>
                  <b-card-text class="pl-3 my-0"><b>Segundo Apellido: </b>{{ proceso.prore_pac_lastname_second }}</b-card-text>
                </b-row>
                <!--<b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Genero:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ formatearGenero(row.item.prore_pac_gender) }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_pac_gender"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Edad:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_pac_age }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_pac_age"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Telefono/Celular:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_phone }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_applicant_phone"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Correo Electrónico:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_applicant_email"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Especialidad:</b> {{ row.item.spe_name }}</b-card-text>
                </b-row>
                <hr>
                <b>Información del Demandante</b>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Primer Nombre:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_first }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_applicant_name_first"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Segundo Nombre:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_secdon }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_applicant_name_secdon"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Primer Apellido:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_first }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_applicant_lastname_first"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Segundo Apellido:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_second }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_applicant_lastname_second"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Telefono/Celular:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_phone }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_phone"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Correo Electrónico:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_email"
                        v-else
                        class="form-control col-md-2"
                      />
                </b-row>
                <hr>
                <b>Información del Demandado</b>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Primer Nombre:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_first }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_defendant_name_first"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Segundo Nombre:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_second }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_defendant_name_second"
                      v-else
                      class="form-control col-md-2"
                    />

                  <b-card-text class="pl-3 my-0"><b>Primer Apellido:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_first }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_defendant_lastname_first"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Segundo Apellido:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_second }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_defendant_lastname_second"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Teléfono/Celular:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_phone }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_defendant_phone"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Correo Electrónico:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_applicant_email"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Tipo de proceso:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.typro_name }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.typro_name"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Juzgado:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.nombre_juzgado }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.nombre_juzgado"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Número radicado:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_num_radicado }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_num_radicado"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <hr>
                <b>LLamado en Garantía</b>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Primer Nombre:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_name_first }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_warranty_name_first"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Segundo Nombre:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_name_second }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_warranty_name_second"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Primer Apellido:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_lastname_first }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_warranty_lastname_first"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Segundo Apellido:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_lastname_second }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_warranty_lastname_second"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-row class="col-md-12 pt-1">
                  <b-card-text class="px-1 my-0"><b>Teléfono/celular:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_phone }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_warranty_phone"
                      v-else
                      class="form-control col-md-2"
                    />
                  <b-card-text class="pl-3 my-0"><b>Correo electrónico:</b></b-card-text>
                  <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_email }}</b-card-text>
                    <input
                      type="text"
                      v-model="row.item.prore_warranty_email"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-row class="col-md-12 pt-5">
                  <b-button class="mr-2" size="sm" @click="row.toggleDetails">Ocultar</b-button>
                  <b-button variant="primary" size="sm" @click="edit(row.item.prore_id)">Editar Proceso</b-button>
                </b-row>-->
              <!--</b-row>-->
              <b-button size="sm" class="mt-4" @click="ocultarProcesos">Ocultar Procesos Juridicos</b-button>
            </b-card>
          </b-collapse>
        </template>
      </iq-card>
    </div>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import 'datatables.net'
import 'datatables.net-bs4'
import Vue from 'vue'

export default {
  name: 'UserList',
  data () {
    return {
      usuarios: [],
      user: {},
      estado: 'd-none',
      columns: [
        { label: 'Nombre', key: 'usr_name_first', class: 'text-left' },
        { label: 'Apellido', key: 'usr_lastname_first', class: 'text-left' },
        {
          label: 'Identificación',
          key: 'pro_identificacion',
          class: 'text-left'
        },
        { label: 'Correo electronico', key: 'usr_email', class: 'text-left' },
        { label: 'Perfil', key: 'profile_name', class: 'text-center' },
        { label: 'Acciones', key: 'show_details', class: 'text-center' }
      ],
      procesos: {},
      detailsShowing: 'Ver'
    }
  },
  mounted () {
    xray.index()
    this.getUsers()
  },
  methods: {
    add () {
      let obj = this.default()
      this.rows.push(obj)
    },
    default () {
      return {
        id: this.rows.length,
        name: '',
        position: '',
        office: '',
        age: '',
        start_date: '2011/04/25',
        salary: '$0',
        editable: false
      }
    },
    edit (item) {
      item.editable = 1
    },
    submit (item) {
      item.editable = 0
      this.user.usr_username = item.usr_username
      this.user.usr_email = item.usr_email
      axios.put('/users/update/' + item.usr_id, this.user).then(res => {
        if (res.data.status_code === 200) {
          this.$router.push({ name: 'doctor.list' })
        } else {
          alert('Datos no validos')
        }
      })
    },
    remove (item) {
      let index = this.rows.indexOf(item)
      this.rows.splice(index, 1)
    },
    getUsers () {
      axios.get('/users').then(response => {
        this.usuarios = response.data.usuarios
        console.log(this.usuarios.pro_id)
      })
    },
    consultarProcesosJuridicos (usrId) {
    },
    esAbogado (profileId) {
      if (profileId === 2) {
        return true
      } else {
        return false
      }
    },
    editarUsuario (usuarioId) {
      // `/process/process-edit/${item}`
      this.$router.push({ path: `/doctor/profile-edit/${usuarioId}` })
    },
    obtenerProcesos (profesionalId) {
      this.procesos = ''
      axios.get('/professionals/obtenerProcesos/' + profesionalId).then(res => {
        if (res.data.status_code === 200) {
          this.procesos = res.data.procesos
          // this.estado = ''
          // this.detailsShowing = 'Ocultar'
        } else {
          Vue.swal(res.data.meesage)
        }
      })
        .catch((err) => {
          Vue.swal('Ups sucedió un error tratando de consulta la información')
          console.log(err)
        })
    },
    ocultarProcesos () {
      this.estado = 'd-none'
    }
  },
  firestore () {
    return {}
  },
  components: {},
  beforeMount () {},
  method: {},
  computed: {}
}
</script>
