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
                <b-col lg="8">
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
                        <ValidationProvider
                              name="Seguimiento"
                              rules="required"
                              v-slot="{ errors }"
                            >
                        <v-select
                          v-model="tiposSegumientoId"
                          :options="tiposSegumientoOptions"
                          :reduce="(label) => label.code"
                          label="label"
                          id="tipo_id"
                          :class="errors.length > 0 ? ' is-invalid' : ''"
                        >
                          <span slot="no-options"
                            >No hay Tipos de Actividad.</span
                          >
                        </v-select>
                        <div class="invalid-feedback">
                                <span>Debe de seleccionar un tipo de Seguimiento</span>
                              </div>
                            </ValidationProvider>
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
                      <b-row>
                        <b-form-file
                          class="col-md-6"
                          v-model="casefile.file"
                          :name="`file-${index}`"
                          placeholder="Añadir archivo"
                        ></b-form-file>
                        <b-form-datepicker
                          placeholder="Fecha de Recepción"
                          class="col-md-4"
                          style="margin-left: 10px; height: 35px"
                          id="exampleInputdate"
                          :date-format-options="{
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            weekday: 'short'
                          }"
                          v-model="casefile.date"
                          locale="es"
                        ></b-form-datepicker>
                        <b-button
                          size="sm"
                          variant="danger"
                          style="margin-left: 10px; height: 30px"
                          v-b-tooltip.hover
                          title="Quitar archivo"
                          @click="removeFile(index)"
                          ><em class="fa fa-times"></em
                        ></b-button>
                      </b-row>
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
      validData: true,
      caseFiles: [
        {
          file: null,
          date: null
        }
      ]
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
          if (casefile.date != null) {
            data.append('file-' + index, casefile.file, casefile.file.name) // note, no square-brackets
            data.append('file_date-' + index, casefile.date)
            index++
          } else {
            this.validData = false
            Vue.swal('Debes subir archivos con fecha de recepción')
          }
        }
      }

      data.append('cantidad_archivos', index)
      if (this.validData) {
        axios.post('/seguimiento/create', data).then((res) => {
          if (res.status === 200) {
            this.onCreate()
          }
          Vue.swal(res.data.message)
          this.estadoBoton = ''
          this.textoBoton = 'Guardar'
        })
      } else {
        this.estadoBoton = ''
        this.textoBoton = 'Guardar'
      }
    }
  }
}
</script>
