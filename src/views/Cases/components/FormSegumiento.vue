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
                <b-col lg="7">
                  <b-row>
                    <b-col cols="8">
                      <b-form-group label="Titulo:" label-for="seg_title">
                        <b-form-input
                          v-model="seguimiento_title"
                          id="seg_title"
                          type="text"
                          size="sm"
                          :required="true"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <b-form-group label="Tipo" label-for="tipo_id">
                        <v-select
                          v-model="tiposSegumientoId"
                          :options="tiposSegumientoOptions"
                          :reduce="(label) => label.code"
                          label="label"
                          id="tipo_id"
                        >
                          <span slot="no-options"
                            >No hay Tipos de Actividad.</span
                          >
                        </v-select>
                      </b-form-group>
                    </b-col>
                  </b-row>

                  <b-form-group
                    label="Descripción:"
                    label-for="textarea-decription"
                  >
                    <b-form-textarea
                      id="textarea-decription"
                      v-model="seguimiento_description"
                      rows="3"
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
                      ><em class="fa fa-plus"></em> </b-button
                    ><b-button
                      size="sm"
                      variant="danger"
                      style="margin-left: 5px"
                      v-b-tooltip.hover
                      title="Quitar archivo"
                      @click="removeFile"
                      ><em class="fa fa-minus"></em></b-button
                  ></b-form-group>
                  <b-form-group>
                    <b-button
                      style="margin-right: 10px"
                      :class="estadoBoton"
                      @click="onCancel"
                      >Cancelar</b-button
                    >
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
  name: 'FormSegumiento',
  props: {
    case_id: String,
    onCreate: Function,
    onCancel: Function
  },
  data () {
    return {
      seguimiento_title: '',
      seguimiento_description: '',
      tiposSegumientoId: '',
      tiposSegumientoOptions: [],
      textoBoton: 'Guardar',
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
    this.getTiposSegumiento()
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
      this.crearSeguimiento()
    },
    getTiposSegumiento () {
      axios.get('/tipos-segumiento/fetch').then((response) => {
        this.tiposSegumientoOptions = response.data.tiposeguimiento
      })
    },
    crearSeguimiento () {
      const data = new FormData()

      data.append('seguimiento_title', this.seguimiento_title)
      data.append('seguimiento_description', this.seguimiento_description)
      data.append('case_id', this.case_id)
      data.append('user_id', this.userLogged.usr_id)
      data.append('seguimiento_tipo', this.tiposSegumientoId)
      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
          index++
        }
      }

      data.append('cantidad_archivos', index)

      axios.post('/seguimiento/create', data).then((res) => {
        if (res.status === 200) {
          this.onCreate()
        }
        Vue.swal(res.data.message)
        this.estadoBoton = ''
        this.textoBoton = 'Guardar'
      })
    }
  }
}
</script>
