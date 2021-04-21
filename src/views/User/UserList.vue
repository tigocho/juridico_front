<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Usuarios</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" @click="add">Add New</b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="table-responsive">
                <b-table bordered hover :items="doctors" :fields="columns" foot-clone>
                  <template v-slot:cell(usr_username)="data">
                    <span v-if="!data.item.editable">{{ data.item.usr_username }}</span>
                    <input type="text" v-model="data.item.usr_username" v-else class="form-control">
                  </template>
                  <template v-slot:cell(usr_identification)="data">
                    <span v-if="!data.item.editable">{{ data.item.usr_identification }}</span>
                    <input type="text" v-model="data.item.usr_identification" v-else class="form-control">
                  </template>
                  <template v-slot:cell(usr_email)="data">
                    <span v-if="!data.item.editable">{{ data.item.usr_email }}</span>
                    <input type="text" v-model="data.item.usr_email" v-else class="form-control">
                  </template>
                  <template v-slot:cell(age)="data">
                    <span v-if="!data.item.editable">{{ data.item.age }}</span>
                    <input type="text" v-model="data.item.age" v-else class="form-control">
                  </template>
                  <template v-slot:cell(start_date)="data">
                    <span v-if="!data.item.editable">{{ data.item.start_date }}</span>
                    <input type="text" v-model="data.item.start_date" v-else class="form-control">
                  </template>
                  <template v-slot:cell(salary)="data">
                    <span v-if="!data.item.editable">{{ data.item.salary }}</span>
                    <input type="text" v-model="data.item.salary" v-else class="form-control">
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button variant=" iq-bg-success mr-1 mb-1" size="sm" @click="edit(data.item)" v-if="!data.item.editable"><i class="ri-ball-pen-fill m-0"></i></b-button>
                    <b-button variant=" iq-bg-success mr-1 mb-1" size="sm" @click="submit(data.item)" v-else>Ok</b-button>
                    <b-button variant=" iq-bg-danger" size="sm" @click="remove(data.item)"><i class="ri-delete-bin-line m-0"></i></b-button>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  name: 'UserList',
  data () {
    return {
      doctors: [],
      columns: [
        { label: 'Nombre', key: 'usr_username', class: 'text-left' },
        { label: 'Identificacióm', key: 'usr_identification', class: 'text-left' },
        { label: 'Correo electronico', key: 'usr_email', class: 'text-left' }
      ],
      rows: [
        {
          id: 1,
          usr_username: 'Tiger Nixon',
          usr_identification: 'System Architect',
          usr_email: 'wa@wa.com'
        },
        {
          id: 2,
          usr_username: 'Garrett Winters',
          usr_identification: 'Accountant',
          usr_email: 'wa@wa.com'
        },
        {
          id: 3,
          usr_username: 'Ashton Cox',
          usr_identification: 'Junior Technical Author',
          usr_email: 'wa@wa.com'
        }
      ]
    }
  },
  mounted () {
    xray.index()
    axios.get('/users').then(response => (this.doctors = response.data.users))
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
      item.editable = true
    },
    submit (item) {
      item.editable = false
    },
    remove (item) {
      let index = this.rows.indexOf(item)
      this.rows.splice(index, 1)
    }
  },
  firestore () {
    return {
    }
  },
  components: {
  },
  beforeMount () {
  },
  method: {
  },
  computed: {
  }
}
</script>
