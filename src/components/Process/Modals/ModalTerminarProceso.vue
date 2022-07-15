<template>
<b-container fluid>
  <b-modal id="modal-terminar-proceso" size="md" title="Terminar proceso" hide-footer>
    <form ref="form">
      <p v-if="errors.length">
        <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <b-row>
        <b-col class="text-center" md="12">
          <h4>Número de radicado: {{num_radicado}}</h4>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col md="6">
          <b-form-group label="Estado" label-for="proce_estado_terminado">
            <b-form-select plain v-model="proceeding.proce_estado_terminado" :options="optionsEstados" id="proce_estado_terminado">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>Seleccione un Estado</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Fecha de terminación*" label-for="proce_fecha_ingreso">
            <b-form-input id="proce_fecha_ingreso" v-model="proceeding.proce_fecha_ingreso" type="date" ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-col md="13">
          <b-form-group label="Abogada/o*" label-for="agen_pro_id">
            <b-form-select plain v-model="proceeding.proce_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>Seleccione abogado</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
      <b-row>
        <b-col md="12">
          <b-form-textarea v-model="proceeding.proce_descripcion" type="text" placeholder="Descripción*"></b-form-textarea>
        </b-col>
      </b-row>
      <div class="text-right pt-3">
        <b-button class="sm-3 mr-1" variant="secondary" @click="cancelado">Cancelar</b-button>
        <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="mostrarModalConfirmacion">{{ textoGuardarActuacion }}</b-button>
      </div>
    </form>
  </b-modal>
</b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit.js'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'ModalTerminarProceso',
  props: ['prore_id', 'usr_id', 'num_radicado'],
  mounted () {
    xray.index()
    this.fetchOptionsAbogados()
  },
  data () {
    return {
      errors: [],
      error: {},
      abogadoOptions: [],
      optionsEstados: [
        { value: 0, text: 'En contra' },
        { value: 1, text: 'A favor' }
      ],
      botonGuardarModal: '',
      textoConfirmacion: 'mensaje de testeo',
      mostrarConfirmacion: false,
      textoGuardarActuacion: 'Terminar Proceso',
      proceeding: {
        proce_id: null,
        proce_prore_id: null,
        proce_pro_id: null,
        proce_sta_id: 16,
        proce_fecha_ingreso: null,
        proce_fecha_actualizacion: null,
        proce_descripcion: null,
        proce_fecha_siguiente_audiencia: null,
        proce_hora_siguiente_audiencia: null,
        proce_estado_terminado: null
      }
    }
  },
  methods: {
    fetchOptionsAbogados () {
      axios.get('/professionals/fetchOld').then(response => {
        this.abogadoOptions = response.data.professionals
      })
    },
    cancelado () {
      this.$bvModal.hide('modal-terminar-proceso')
      this.limpiarModalActuacion()
    },
    guardarActuacion () {
      let _this = this
      this.botonGuardarModal = 'disabled'
      this.textoGuardarActuacion = 'Guardando actuación...'
      if (this.usr_id != null && this.usr_id !== '') {
        this.proceeding.proce_user_id = this.usr_id
      }
      this.proceeding.proce_prore_id = _this.prore_id
      axios.post('/proceedings/store', { formulario_proceeding: this.proceeding, links: [] }).then(res => {
        this.textoGuardarActuacion = 'Guardar'
        this.botonGuardarModal = ''
        if (res.data.status_code === 200) {
          this.$swal.fire({
            icon: 'success',
            title: '¡Proceso terminado!',
            text: res.data.message,
            confirmButtonColor: '#068391'
          })
          this.$bvModal.hide('modal-terminar-proceso')
          this.limpiarModalActuacion()
          this.$emit('actualizarListaProcesos')
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.textoGuardarActuacion = 'Guardar'
          this.botonGuardarModal = ''
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    mostrarModalConfirmacion () {
      if (this.checkFormActuacion()) {
        let _this = this
        this.$swal.fire({
          icon: 'warning',
          title: '¿Terminar proceso?',
          text: 'Esta acción no se podrá revertir. Se archivará el proceso: ' + _this.num_radicado,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Terminar proceso',
          confirmButtonColor: '#f7505a',
          customClass: 'sweetalert-btns',
          showCloseButton: true
        }).then((result) => {
          if (result.value) {
            this.guardarActuacion()
          }
        })
      } else {
        return false
      }
    },
    checkFormActuacion () {
      if (this.proceeding.proce_pro_id && this.proceeding.proce_sta_id && this.proceeding.proce_fecha_ingreso && this.proceeding.proce_descripcion) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.proceeding.proce_pro_id) {
        this.errors.push('El abogado es obligatorio.')
      }
      if (!this.proceeding.proce_sta_id) {
        this.errors.push('La etapa del proceso es obligatoria.')
      }
      if (!this.proceeding.proce_fecha_ingreso) {
        this.errors.push('La fecha de ingreso es obligatoria.')
      }
      if (!this.proceeding.proce_estado_terminado) {
        this.errors.push('El estado es obligatorio.')
      }
    },
    limpiarModalActuacion () {
      this.proceeding.proce_prore_id = null
      this.proceeding.proce_pro_id = null
      this.proceeding.proce_sta_id = 16
      this.proceeding.proce_fecha_ingreso = null
      this.proceeding.proce_fecha_actualizacion = null
      this.proceeding.proce_descripcion = null
      this.proceeding.proce_fecha_siguiente_audiencia = null
      this.proceeding.proce_hora_siguiente_audiencia = null
    }
  }
}
</script>
