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
              <b-button :class="esAbogado(row.item.profile_id) ? '' : 'disabled'" size="sm" @click="row.toggleDetails" class="mr-2">
                {{ row.detailsShowing ? 'Ocultar' : 'Ver'}} Procesos
              </b-button>
              <b-button size="sm" variant="primary" @click="editarUsuario(row.item.user_id)">
                Editar
              </b-button>
            </template>

            <template #row-details="row">
              <b-card>
                <b>Procesos Juridicos Asignados:</b>
                <br>
                <br>
                <b-row class="col-md-12">
                  <b-col class="col-md-2"><b>Número de Radicado:</b></b-col>
                    <span v-if="row.item.editable!=0">{{
                      row.item.prore_num_radicado
                    }}</span>
                    <input
                      type="text"
                      v-model="row.item.prore_num_radicado"
                      v-else
                      class="form-control col-md-2"
                    />
                </b-row>
                <b-button size="sm" @click="row.toggleDetails">Ocultar Procesos Juridicos</b-button>
              </b-card>
            </template>
          </b-table>
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
export default {
  name: 'UserList',
  data () {
    return {
      usuarios: [],
      user: {},
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
      ]
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
