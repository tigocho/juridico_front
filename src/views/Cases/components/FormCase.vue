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
                  <b-row v-if="!onEdit">
                    <b-form-group
                      class="col-md-6"
                      label="Actividad*"
                      label-for="act_id"
                    >
                      <v-select
                        v-model="actividad_id"
                        :options="actividadesOptions"
                        :reduce="(label) => label.code"
                        label="label"
                        id="act_id"
                        @input="getSubactividades"
                      >
                        <span slot="no-options">No hay Actividades.</span>
                      </v-select>
                    </b-form-group>
                    <b-form-group
                      class="col-md-6"
                      label="Subactividad*"
                      label-for="subact_id"
                    >
                      <v-select
                        @input="getTiempoAns"
                        v-model="subactividad_id"
                        :options="subactividadesOptions"
                        :reduce="(label) => label.code"
                        label="label"
                        id="subact_id"
                      >
                        <span slot="no-options">No hay Subctividades.</span>
                      </v-select>
                      <p :key="fechaSolucionKey" class="text-left" v-if="fechaSolucion !== null">Fecha apróximada de solución o respuesta: {{ fechaSolucion }}</p>
                    </b-form-group>
                  </b-row>
                  <b-row>
                    <b-col v-if="clinicasUser.length > 1" xs="12">
                      <b-form-group
                        label="Clinica*"
                        label-for="user_id"
                      >
                        <v-select
                          v-model="clinicaSeleccionada"
                          :options="clinicasUser"
                          :reduce="(label) => label.code"
                          label="label"
                          id="user_id"
                        >
                        <span slot="no-options">No hay Clinicas.</span>
                      </v-select>
                      </b-form-group>
                    </b-col>
                    <b-col xs="12">
                      <b-form-group
                        label="Asunto*"
                        label-for="case_title"
                      >
                        <b-form-input
                          v-model="caseTitle"
                          type="text"
                          :required="true"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-form-group
                    label="Descripción del asunto*"
                    label-for="textarea-decription"
                  >
                    <b-form-textarea
                      id="textarea-decription"
                      v-model="caseDescription"
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
    case_id: Number,
    case_title: String,
    case_description: String,
    onEdit: Boolean,
    reloadFunciont: Function
  },
  data () {
    return {
      clinicasUser: [],
      clinicaSeleccionada: null,
      actividadesOptions: [],
      caseTitle: '',
      caseDescription: '',
      actividad_id: '',
      subactividadesOptions: [],
      subactividad_id: '',
      textoBoton: 'Guardar Caso',
      estadoBoton: '',
      caseFiles: [
        {
          file: null
        }
      ],
      intentos: 0,
      fechaSolucion: null,
      fechaSolucionKey: 0
    }
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    this.getActividades()
    if (!this.onEdit) this.getUserClinicas()
    this.caseTitle = this.case_title
    this.caseDescription = this.case_description
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

      data.append('case_title', this.caseTitle)
      data.append('case_description', this.caseDescription)

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
          if (res.data.clinicas.length > 1) {
            for (let clinica of res.data.clinicas) {
              this.clinicasUser.push(clinica)
            }
          } else {
            this.clinicaSeleccionada = res.data.clinicas[0].code
          }
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    crearCaso () {
      const data = new FormData()

      data.append('case_title', this.caseTitle)
      data.append('case_description', this.caseDescription)
      data.append('user_id', this.userLogged.usr_id)
      data.append('clinica_id', this.clinicaSeleccionada)
      data.append('subactividad_id', this.subactividad_id)

      let index = 0
      for (let casefile of this.caseFiles) {
        if (casefile.file != null) {
          data.append('file-' + index, casefile.file, casefile.file.name)
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
    },
    getActividades () {
      axios.get('/actividades/fetch').then((response) => {
        this.actividadesOptions = response.data.actividades
      })
    },
    getSubactividades () {
      this.subactividad_id = ''
      this.fechaSolucion = null
      this.fechaSolucionKey++
      axios
        .get('/subactividades/fetch/' + this.actividad_id)
        .then((response) => {
          this.subactividadesOptions = response.data.subactividades
        })
    },
    getTiempoAns () {
      axios.get('/subactividades/getTiempoAns/' + this.subactividad_id).then(res => {
        this.fechaSolucion = res.data.fechaSolucion
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getTiempoAns()
            this.intentos++
          }
        })
    }
  }
}
</script>
