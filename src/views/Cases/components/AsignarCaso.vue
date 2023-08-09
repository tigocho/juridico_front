<template>
  <div>
    <ValidationObserver ref="form-2" v-slot="{ handleSubmit }">
      <form ref="form-2" @submit.prevent="handleSubmit(saveAsignacionCaso)">
        <b-row>
          <b-col lg="10" class="pagina-detalle-proceso">
            <b-card-text style="margin-left: 15px">
              <b-row>
                <strong>Asunto: </strong>&nbsp;
                {{ casoInfo.caso_titulo }} </b-row
              ><b-row>
                <strong>Descripcion: </strong>&nbsp;
                {{ casoInfo.caso_descripcion }}
              </b-row>
            </b-card-text>
            <b-form-group label="Abogado*" label-for="profesional_id">
              <v-select
                v-model="asginarData.profesional_id"
                :options="profesionalesOptions"
                :reduce="(label) => label.code"
                label="label"
                id="profesional_id"
              >
                <span slot="no-options">No hay Abogados.</span>
              </v-select>
            </b-form-group>
            <b-form-group label="Actividad*" label-for="actividad_id">
              <v-select
                v-model="asginarData.actividad_id"
                :options="actividadesOptions"
                :reduce="(label) => label.code"
                label="label"
                id="actividad_id"
                @input="getSubactividades"
              >
                <span slot="no-options">No hay actividades.</span>
              </v-select>
            </b-form-group>
            <b-form-group label="Subactividad*" label-for="subactividad_id">
              <v-select
                v-model="asginarData.subactividad_id"
                :options="subactividadesOptions"
                :reduce="(label) => label.code"
                label="label"
                id="subactividad_id"
              >
                <span slot="no-options">No hay subactividades.</span>
              </v-select>
            </b-form-group>
            <b-form-group
              label="Observación"
              label-for="textarea-observacion"
            >
              <b-form-textarea
                class="col-md-12"
                id="textarea-observacion"
                v-model="asginarData.observacion"
              ></b-form-textarea>
            </b-form-group>
            <div v-if="archivos.length > 0">
              <h5>Documentos Caso:</h5>
              <div
                style="margin-top: 5px"
                v-for="(archivo, index) in archivos"
                :key="archivo.arch_casos_id + index"
              >
                <b-card-text>
                  <b-col>
                    <span
                      :style="
                        archivo.deleted_at != null
                          ? 'opacity: 0.4;'
                          : 'text-decoration: underline;cursor: pointer;'
                      "
                      @click="
                        descargarArchivo(
                          archivo.arch_casos_nombre,
                          archivo.arch_casos_id
                        )
                      "
                      v-b-tooltip.hover
                      title="Descargar archivo"
                      >{{ archivo.arch_casos_nombre }}
                      {{
                        archivo.deleted_at != null
                          ? '  eliminado por ' + archivo.user
                          : ' '
                      }} </span
                    >&nbsp;
                    <strong> Fecha de Recepcion: </strong>
                    {{ archivo.arch_casos_fecha_recepcion }}
                  </b-col>
                </b-card-text>
              </div>
            </div>
            <b-form-group style="padding-top: 20px;">
              <b-button :class="estadoBoton" variant="primary" type="submit"
                >{{ textoBoton }}</b-button
              >
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
import axios from 'axios'
import auth from '@/logic/auth'
import Vue from 'vue'
export default ({
  name: 'AsignarCaso',
  props: {
    casoInfo: {
      type: Object,
      required: true
    },
    archivos: Array,
    descargarArchivoCaso: Function,
    recargarCaso: Function
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Asignar Caso',
      caseFiles: [
        {
          file: null
        }
      ],
      profesionalesOptions: [],
      asginarData: {
        profesional_id: '',
        actividad_id: '',
        subactividad_id: '',
        observacion: ''
      },
      user_profile: null,
      intentos: 0,
      actividadesOptions: [],
      subactividadesOptions: [],
      errores: 0
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
    this.getActividades()
    this.getProfesionals()
  },
  methods: {
    getProfesionals () {
      axios.get('/professionals/fetch').then((response) => {
        this.profesionalesOptions = response.data.professionals
      })
    },
    getActividades () {
      axios.get('/actividades/fetch').then((response) => {
        this.actividadesOptions = response.data.actividades
        this.intentos = 0
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getActividades()
            this.intentos++
          }
        })
    },
    getSubactividades () {
      this.subactividad_id = ''
      axios
        .get('/subactividades/fetch/' + this.asginarData.actividad_id)
        .then((response) => {
          this.subactividadesOptions = response.data.subactividades
          this.intentos = 0
        })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getSubactividades()
            this.intentos++
          }
        })
    },
    saveAsignacionCaso () {
      this.estadoBoton = 'disabled'
      this.textoBoton = 'Asignando caso...'
      if (this.asginarData.profesional_id !== '' && this.asginarData.actividad_id !== '' && this.asginarData.subactividad_id !== '') {
        axios
          .post('/casos/asignar/' + this.casoInfo.caso_id, this.asginarData)
          .then((res) => {
            if (res.status === 200) {
              this.intentos = 0
              Vue.swal(res.data.message)
              this.recargarCaso()
            }
            this.$bvModal.hide('modal-asignar-caso')
            this.estadoBoton = ''
            this.textoBoton = 'Asignar Caso'
          })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.saveAsignacionCaso()
              this.intentos++
            } else {
              Vue.swal(err.response.data.message)
              this.$bvModal.hide('modal-asignar-caso')
            }
            this.estadoBoton = ''
            this.textoBoton = 'Asignar Caso'
          })
      } else {
        Vue.swal('Por favor diligenciar los campos obligatorios')
      }
    },
    descargarArchivo (filename, id) {
      this.descargarArchivoCaso(filename, id)
    }
  }
})
</script>
