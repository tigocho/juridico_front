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
                <b-table
                  bordered
                  hover
                  :items="doctors"
                  :fields="columns"
                  foot-clone
                >
                  <template v-slot:cell(usr_username)="data">
                    <span v-if="!data.item.editable">{{
                      data.item.usr_username
                    }}</span>
                    <input
                      type="text"
                      v-model="data.item.usr_username"
                      v-else
                      class="form-control"
                    />
                  </template>
                  <template v-slot:cell(usr_identification)="data">
                    <span v-if="!data.item.editable">{{
                      data.item.usr_identification
                    }}</span>
                    <input
                      type="text"
                      v-model="data.item.usr_identification"
                      v-else
                      class="form-control"
                    />
                  </template>
                  <template v-slot:cell(usr_email)="data">
                    <span v-if="!data.item.editable">{{
                      data.item.usr_email
                    }}</span>
                    <input
                      type="text"
                      v-model="data.item.usr_email"
                      v-else
                      class="form-control"
                    />
                  </template>
                  <template v-slot:cell(age)="data">
                    <span v-if="!data.item.editable">{{ data.item.age }}</span>
                    <input
                      type="text"
                      v-model="data.item.age"
                      v-else
                      class="form-control"
                    />
                  </template>
                  <template v-slot:cell(start_date)="data">
                    <span v-if="!data.item.editable">{{
                      data.item.start_date
                    }}</span>
                    <input
                      type="text"
                      v-model="data.item.start_date"
                      v-else
                      class="form-control"
                    />
                  </template>
                  <template v-slot:cell(salary)="data">
                    <span v-if="!data.item.editable">{{
                      data.item.salary
                    }}</span>
                    <input
                      type="text"
                      v-model="data.item.salary"
                      v-else
                      class="form-control"
                    />
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="edit(data.item)"
                      v-if="!data.item.editable"
                      ><i class="ri-ball-pen-fill m-0"></i
                    ></b-button>
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="submit(data.item)"
                      v-else
                      >Ok</b-button
                    >
                    <b-button
                      variant=" iq-bg-danger"
                      size="sm"
                      @click="remove(data.item)"
                      ><i class="ri-delete-bin-line m-0"></i
                    ></b-button>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
          <template>
            <div class="table-responsive">
              <table
                id="tablePlaneacion"
                class="table table-striped table-bordered"
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>Pendiente</th>
                    <th>Pabellon</th>
                    <th>F.Ingreso</th>
                    <th>Ident.</th>
                    <th>T.Doc</th>
                    <th>Nombres</th>
                    <th>Procedim.</th>
                    <th>Cel</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody></tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th>Ptes</th>
                    <th>Pabellon</th>
                    <th>F.Ingreso</th>
                    <th>Ident.</th>
                    <th>T.Doc</th>
                    <th>Nombres</th>
                    <th>Procedim.</th>
                    <th>Cel</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-bs4'
axios.defaults.baseURL = 'http://localhost:8000/api'
export default {
  name: 'UserList',
  data () {
    return {
      doctors: [],
      columns: [
        { label: 'Nombre', key: 'usr_username', class: 'text-left' },
        {
          label: 'Identificacióm',
          key: 'usr_identification',
          class: 'text-left'
        },
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
      item.editable = true
    },
    submit (item) {
      item.editable = false
    },
    remove (item) {
      let index = this.rows.indexOf(item)
      this.rows.splice(index, 1)
    },
    getUsers () {
      axios.get('/users').then(response => {
        this.doctors = response.data.users
        $('#tablePlaneacion').DataTable({
          data: response.data.users,
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'pdfHtml5',
              orientation: 'landscape',
              pageSize: 'LEGAL'
            },
            'excel',
            'print'
          ],
          pageLength: 5,
          lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
          'language': {
            'sProcessing': 'Procesando...',
            'sLengthMenu': 'Mostrar _MENU_ registros',
            'sZeroRecords': 'No se encontraron resultados',
            'sEmptyTable': 'Ningun dato disponible en esta tabla',
            'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_',
            'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0',
            'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
            'sInfoPostFix': '',
            'sSearch': 'Buscar:',
            'sUrl': '',
            'sInfoThousands': ',',
            'sLoadingRecords': 'Cargando...',
            'oPaginate': {
              'sFirst': 'Primero',
              'sLast': 'Ultimo',
              'sNext': 'Siguiente',
              'sPrevious': 'Anterior'
            },
            'oAria': {
              'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
              'sSortDescending': ': Activar para ordenar la columna de manera descendente'
            }
          },
          'order': [[ 3, 'desc' ]],
          columns: [
            {
              className: 'details-control',
              orderable: false,
              data: null,
              defaultContent: ''
            },
            { data: 'usr_identification' },
            { data: 'usr_identification' },
            { data: 'usr_username' },
            { data: 'usr_username' },
            { data: 'usr_email' },
            { data: 'usr_email' },
            { data: 'usr_identification' },
            { data: 'usr_username' },
            { data: 'usr_email' },
            {
              defaultContent: [
                '<button type="button" class="btn btn-primary Planear"><i class="ri-pie-chart-box-fill"></i>Planear</button>',
                '<button type="button" class="btn btn-danger Delete"><i class="ri-pie-chart-box-fill"></i>Cancelar</button>'
              ]
            }
          ]
        })
      })
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
