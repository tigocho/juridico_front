<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <form class="mt-4" @submit.prevent="handleSubmit(onSubmit)">
            <template>
              <b-row
                class="justify-content-center text-center align-items-center"
              >
                <b-col lg="6">
                  <b-form-group
                    label="Titulo de la Solicitud*"
                    label-for="case_title"
                  >
                    <b-form-input
                      v-model="case_title"
                      type="text"
                      :required="true"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Descripción*"
                    label-for="textarea-decription"
                  >
                    <b-form-textarea
                      id="textarea-decription"
                      v-model="case_description"
                      rows="3"
                      :state="
                        case_description.length <= 250 &&
                        case_description.length >= 5
                      "
                      :required="true"
                    ></b-form-textarea>
                  </b-form-group>
                  <div v-for="(casefile, index) in caseFiles" :key="index">
                    <b-form-group>
                      <b-form-file
                        v-model="casefile.file"
                        :name="`file-${index}`"
                        placeholder="Añade un archivo"
                      ></b-form-file>
                    </b-form-group>
                  </div>
                  <b-form-group
                    ><b-button
                      size="sm"
                      variant="success"
                      v-b-tooltip.hover
                      title="Adjuntar otro archivo"
                      @click="addFile"
                      ><i class="fa fa-plus"></i> </b-button
                    ><b-button
                      size="sm"
                      variant="danger"
                      style="margin-left: 5px"
                      v-b-tooltip.hover
                      title="Quitar archivo"
                      @click="removeFile"
                      ><i class="fa fa-minus"></i></b-button
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
          </form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import auth from '@/logic/auth'
export default {
  name: 'FormCase',
  props: {
    case_id: String,
    case_title: String,
    case_description: String,
    onEdit: Boolean,
    reloadFunciont: Function
  },
  data () {
    return {
      clinicasUser: [],
      textoBoton: 'Guardar Caso',
      estadoBoton: '',
      caseFiles: [
        {
          file: null
        }
      ]
    }
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    if (!this.onEdit) this.getUserClinicas()
  },
  methods: {
    addFile () {
      this.caseFiles.push({
        file: null
      })
    },
    removeFile () {
      this.caseFiles.pop()
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.textoBoton = 'Guardando...'
      if (this.onEdit) {
        this.actualizarCaso()
      } else {
        this.crearCaso()
      }
    },
    actualizarCaso () {
      const data = new FormData()

      data.append('case_title', this.case_title)
      data.append('case_description', this.case_description)

      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
          index++
        }
      }

      data.append('cantidad_archivos', index)

      axios.post('/casos/update/' + this.case_id, data).then((res) => {
        if (res.status === 200) {
          this.reloadFunciont()
        }
        Vue.swal(res.data.message)
      })
    },
    getUserClinicas () {
      axios.get('/clinicas/' + this.userLogged.usr_id).then((res) => {
        if (res.data.success === 200) {
          for (let i = 0; i < res.data.clinicas.length; i++) {
            this.clinicasUser.push(res.data.clinicas[i].code)
          }
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    crearCaso () {
      const data = new FormData()

      data.append('case_title', this.case_title)
      data.append('case_description', this.case_description)
      data.append('user_id', this.userLogged.usr_id)
      data.append('clinica_id', this.clinicasUser[0])
      // data.append('import_file', this.import_file)
      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
          index++
        }
      }

      data.append('cantidad_archivos', index)

      axios.post('/casos/create', data).then((res) => {
        if (res.status === 200) {
          this.$router.push({ path: `/cases/cases-show/${res.data.caso_id}` })
        }
        Vue.swal(res.data.message)
      })
    }
  }
}
</script>
