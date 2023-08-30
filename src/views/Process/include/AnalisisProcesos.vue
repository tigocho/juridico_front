<template>
  <iq-card>
    <template v-slot:headerTitle>
      <h4 class="card-title">Análisis del proceso</h4>
    </template>
    <template v-slot:headerAction>
      <div class="text-right">
        <b-button variant="secondary" class="mr-2" v-if="editandoAnalisis" @click="editarAnalisis">Cancelar</b-button>
        <b-button v-if="!editandoAnalisis" variant="primary" :disabled="(process.prore_estado == 1 && usr_proffile != 1) && usr_proffile != 1" :class="estadoBotonActualizarAnalisis" @click="editarAnalisis">{{ textoEditarAnalisis }}</b-button>
        <b-button v-else variant="primary" :disabled="processAnalisis.prore_estado == 1 || !verificarCampos" @click="guardarAnalisis">{{ textoEditarAnalisis }}</b-button>
      </div>
    </template>
    <template v-slot:body>
      <div v-if="!editandoAnalisis">
        <b-row class="col-md-12 pt-1">
          <b-card-text class="my-0 pr-12"
            ><b>Análisis jurídico: </b
            ><span v-if="processAnalisis.prore_analisis_juridico != null">{{
              processAnalisis.prore_analisis_juridico
            }}</span
            ><span v-else class="text-danger">Sin diligenciar</span></b-card-text
          >
        </b-row>
        <hr />
        <b-row class="col-md-12 pt-1">
          <b-card-text class="my-0 pr-12"
            ><b>Análisis Médico: </b
            ><span v-if="processAnalisis.prore_analisis_medico != null">{{
              processAnalisis.prore_analisis_medico
            }}</span
            ><span v-else class="text-danger">Sin diligenciar</span></b-card-text
          >
        </b-row>
        <hr />
        <b-row class="col-md-12 pt-1">
          <b-card-text class="my-0 pr-12"
            ><b>Resumen ejecutivo (final del litigio): </b
            ><span v-if="processAnalisis.prore_resumen_ejecutivo != null">{{
              processAnalisis.prore_resumen_ejecutivo
            }}</span
            ><span v-else class="text-danger">Sin diligenciar</span></b-card-text
          >
        </b-row>
      </div>
      <div v-else>
        <b-row class="col-md-12 pt-1">
          <b-form-group
            class="col-md-12"
            label="Análisis Jurídico"
            label-for="textarea-decription"
          >
            <b-form-textarea
              class="col-md-12"
              id="textarea-decription"
              v-model="analisisJuridico"
              rows="12"
              :state="
                analisisJuridico.length <= 2500
              "
            ></b-form-textarea>
            <span>Cantidad caracteres (máx 2500): {{ analisisJuridico.length }}</span>
          </b-form-group>
          <hr />
          <b-form-group
            class="col-md-12"
            label="Análisis Médico"
            label-for="textarea-decription"
          >
            <b-form-textarea
              class="col-md-12"
              id="textarea-decription"
              v-model="analisisMedico"
              rows="12"
              :state="
                analisisMedico.length <= 2500
              "
            ></b-form-textarea>
            <span>Cantidad caracteres (máx 2500): {{ analisisMedico.length }}</span>
          </b-form-group>
          <hr />
          <b-form-group
            class="col-md-12"
            label="Resumen ejecutivo (final del litigio)"
            label-for="textarea-decription"
          >
            <b-form-textarea
              class="col-md-12"
              id="textarea-decription"
              v-model="resumenEjecutivo"
              rows="12"
              :state="
                resumenEjecutivo.length <= 1000
              "
            ></b-form-textarea>
            <span>Cantidad caracteres (máx 1000): {{ resumenEjecutivo.length }}</span>
          </b-form-group>
        </b-row>
      </div>
    </template>
    <template v-slot:footer>
      <div class="text-right">
        <b-button variant="secondary" class="mr-2" v-if="editandoAnalisis" @click="editarAnalisis">Cancelar</b-button>
        <b-button v-if="!editandoAnalisis" variant="primary" :disabled="process.prore_estado == 1 && usr_proffile != 1" :class="estadoBotonActualizarAnalisis" @click="editarAnalisis">{{ textoEditarAnalisis }}</b-button>
        <b-button v-else variant="primary" :disabled="(process.prore_estado == 1 && usr_proffile != 1) || !verificarCampos" @click="guardarAnalisis">{{ textoEditarAnalisis }}</b-button>
      </div>
    </template>
  </iq-card>
</template>
<script>
import { xray } from './../../../config/pluginInit.js'
import Vue from 'vue'
import iqCard from './../../../components/xray/cards/iq-card.vue'
import axios from 'axios'
export default {
  components: { iqCard },
  name: 'AnalisisProcesos',
  props: {
    process: Object,
    usr_proffile: Number
  },
  mounted () {
    xray.index()
    this.processAnalisis = this.process
    this.analisisJuridico = this.processAnalisis.prore_analisis_juridico != null ? this.processAnalisis.prore_analisis_juridico : ''
    this.analisisMedico = this.processAnalisis.prore_analisis_medico != null ? this.processAnalisis.prore_analisis_medico : ''
    this.resumenEjecutivo = this.processAnalisis.prore_resumen_ejecutivo != null ? this.processAnalisis.prore_resumen_ejecutivo : ''
  },
  data () {
    return {
      editandoAnalisis: false,
      estadoBotonActualizarAnalisis: '',
      textoEditarAnalisis: 'Editar análisis',
      analisisMedico: '',
      analisisJuridico: '',
      resumenEjecutivo: '',
      errores: 0,
      intentos: 0,
      processAnalisis: {}
    }
  },
  computed: {
    verificarCampos () {
      return (
        this.analisisMedico.length <= 2500 && this.analisisJuridico.length <= 2500 && this.resumenEjecutivo.length <= 1000
      )
    }
  },
  methods: {
    editarAnalisis () {
      this.editandoAnalisis = !this.editandoAnalisis
      this.textoEditarAnalisis = !this.editandoAnalisis ? 'Editar análisis' : 'Guardar análisis'
    },
    guardarAnalisis () {
      const body = {
        analisis_medico: this.analisisMedico,
        analisis_juridico: this.analisisJuridico,
        resumen_ejecutivo: this.resumenEjecutivo
      }
      axios.patch('/process/actualizar-analisis/' + this.process.prore_id, body).then(res => {
        this.textoEditarAnalisis = 'Editar análisis'
        if (res.status === 200) {
          this.editandoAnalisis = !this.editandoAnalisis
          if (res.data.process != null) {
            this.processAnalisis = res.data.process
            Vue.swal(res.data.message)
          } else {
            Vue.swal(res.data.message)
          }
        } else {
          Vue.swal('Error tratando de actualizar proceso. ' + res.data.message)
        }
      })
        .catch(error => {
          this.errores = error
          if (this.intentos < 2) {
            this.guardarAnalisis()
            this.intentos++
          } else {
            Vue.swal('Error tratando de actualizar proceso. ' + error)
            this.textoEditarAnalisis = 'Editar análisis'
          }
        })
    }
  }
}
</script>
