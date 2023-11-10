<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <template>
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
              label="Cliente"
              label-for="name-input"
            >
              <v-select v-model="nuevo_solicitante.clinica_id" :options="clinicasOptions" :reduce="label => label.code" label="label" id="nuevo_solicitante_clinica_id">
                <span slot="no-options">No hay clientes.</span>
              </v-select>
            </b-form-group>
            <b-form-group
              label="Tipo documento*"
              label-for="name-input"
            >
              <v-select v-model="nuevo_solicitante.tipo_documento" :options="tipoDocumentoOptions" :reduce="label => label.code" label="label" id="nuevo_solicitante_tipo_documento">
                <span slot="no-options">No hay tipos de documento.</span>
              </v-select>
            </b-form-group>
            <b-form-group
              label="Número de documento*"
              label-for="name-input"
            >
              <b-form-input
                type="number"
                id="name-input"
                v-model="nuevo_solicitante.documento"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Nombre(s)*"
              label-for="name-input"
            >
              <b-form-input
                id="name-input"
                v-model="nuevo_solicitante.nombres"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Apellido(s)*"
              label-for="name-input"
            >
              <b-form-input
                id="name-input"
                v-model="nuevo_solicitante.apellidos"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Celular*">
              <b-form-input v-model="nuevo_solicitante.celular" type="text" placeholder="ej: 3015456561"></b-form-input>
            </b-form-group>
            <b-form-group label="Correo*">
              <b-form-input
                v-model="nuevo_solicitante.email"
                type="email"
                placeholder="info@example.com">
              </b-form-input>
            </b-form-group>
            <div class="text-right pt-1">
              <b-button class="sm-3 mr-1" variant="secondary" @click="cancelar">Cancelar</b-button>
              <b-button class="sm-3" variant="primary" :class="botonGuardarNuevoCliente" @click="crearCliente">{{ textoGuardarModal }}</b-button>
            </div>
          </form>
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'
export default {
  name: 'FormularioCrearCliente',
  data () {
    return {
      clinicasOptions: [],
      nuevo_solicitante: {},
      tipoDocumentoOptions: [
        { label: 'CC.', code: 1 },
        { label: 'TI.', code: 2 },
        { label: 'RC.', code: 3 },
        { label: 'NIT.', code: 4 }
      ],
      textoGuardarModal: 'Guardar cliente/accionante',
      botonGuardarNuevoCliente: ''
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
    this.getUserClinicas()
  },
  methods: {
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        this.clinicasOptions = res.data.clinicas
      })
    },
    crearCliente (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.nuevo_solicitante.clinica_id === '' ||
        this.nuevo_solicitante.tipo_documento === null ||
        this.nuevo_solicitante.documento === '' ||
        this.nuevo_solicitante.nombres === null ||
        this.nuevo_solicitante.apellidos === null ||
        this.nuevo_solicitante.celular === null ||
        this.nuevo_solicitante.email === null
      ) {
        Vue.swal('Por favor complete los datos.')
      } else {
        this.botonGuardarNuevoCliente = 'disabled'
        this.textoGuardarModal = 'Guardando'
        this.handleSubmit()
      }
    },
    handleSubmit () {
      axios.post('/users/guardar-nuevo-solicitante', this.nuevo_solicitante).then(res => {
        if (res.data.status_code === 200) {
          this.cancelar()
          this.botonGuardarNuevoCliente = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Solicitante agregado correctamente')
          // se emite el evento de que el cliente fue creado
          this.$emit('cliente-creado')
          this.nuevo_solicitante.clinica_id = ''
          this.nuevo_solicitante.tipo_documento = ''
          this.nuevo_solicitante.documento = ''
          this.nuevo_solicitante.nombres = ''
          this.nuevo_solicitante.apellidos = ''
          this.nuevo_solicitante.celular = ''
          this.nuevo_solicitante.email = ''
        } else {
          this.botonGuardarNuevoCliente = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('error', 'Datos no validos. ' + res.data.message, 'error')
        }
      })
        .catch((err) => {
          Vue.swal('Error', 'Ocurrió un error tratando de realizar la petición. Intente más tarde ' + err, 'error')
          this.botonGuardarNuevoCliente = ''
          this.textoGuardarModal = 'Guardar'
        })
    },
    cancelar () {
      this.$emit('cerrar-modal-crear-cliente')
    }
  }
}
</script>
