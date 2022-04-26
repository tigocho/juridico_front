<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
          <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <form class="mt-4" @submit.prevent="handleSubmit(onSubmit)">
          <b-row >
            <b-col lg="12">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Crear Caso</h4>
                  <h6 class="card-title">Campos marcados con * son obligatorios</h6>
                </template>
                <template v-slot:body>
                    <b-row class="justify-content-center text-center align-items-center">
                        <b-col lg="6">
                        <b-form-group  label="Titulo de la Solicitud*" label-for="case_title">
                            <b-form-input v-model="cases.case_title" type="text" :required="true" ></b-form-input>
                        </b-form-group>

                        <b-form-group  label="Descripción*" label-for="textarea-decription">
                            <b-form-textarea id="textarea-decription" v-model="cases.case_description" :required="true" ></b-form-textarea>
                        </b-form-group>

                        <b-form-group >
                            <b-form-file class="mt-3" @change="onFileChange" placeholder="Añade un archivo"></b-form-file>

                        </b-form-group>

                        <b-form-group >
                            <b-button variant="primary" type="submit"  :class="estadoBoton">{{ textoBoton }}</b-button>
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
import auth from '@/logic/auth'
import Vue from 'vue'
import axios from 'axios'

export default {
  name: 'AddCase',
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Crear Caso',
      cases: {
        case_title: '',
        case_description: ''
      },
      clinicasUser: [],
      import_file: null
    }
  },
  mounted () {
    this.getUserClinicas()
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  methods: {
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then(res => {
        if (res.data.success === 200) {
          for (let i = 0; i < res.data.clinicas.length; i++) {
            this.clinicasUser.push(res.data.clinicas[i].code)
          }
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getUserClinicas()
            this.intentos++
          }
        })
    },
    onFileChange (e) {
      this.import_file = e.target.files[0]
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.crearCaso()
    },
    crearCaso () {
      this.texttextoBotonoGuardar = 'Guardando...'

      const data = new FormData()

      data.append('case_title', this.cases.case_title)
      data.append('case_description', this.cases.case_description)
      data.append('user_id', this.userLogged.usr_id)
      data.append('clinica_id', this.clinicasUser[0])
      data.append('import_file', this.import_file)

      axios.post('/casos/create', data).then(res => {
        if (res.status === 200) {
          this.$router.push({ path: '/cases/my-cases' })
          Vue.swal(res.data.message)
        } else {
          this.textoGuardar = 'Guardar'
          Vue.swal(res.data.message)
        }
      })
    }
  }
}
</script>
