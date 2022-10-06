<template>
  <iq-card class="p-2">
    <template v-slot:headerTitle>
      <h4 class="card-title">Proceso Laboral</h4>
    </template>
    <template v-slot:headerAction>
      <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
      <b-button variant="primary" :disabled="process.prore_estado == 1 && user_profile != 1" :class="estadoBotonActualizarCuantias" @click="editarProceso">{{ textoEditarCuantias }}</b-button>
    </template>
    <template v-slot:body>
      <div v-if="!editando">
        <b-row class="p-4">
          <b-col md="12">
            <b-card-title class="text-center">Pretensiones económicas</b-card-title>
            <hr>
            <b-card-text><strong>Prestaciones Sociales:</strong> <span v-if="process.prore_prestaciones_sociales != null">{{ formatPrice(process.prore_prestaciones_sociales) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Pretensiones por Vacaciones:</strong> <span v-if="process.prore_pretenciones_vacaciones != null">{{ formatPrice(process.prore_pretenciones_vacaciones) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Indemnización por despido sin justa causa:</strong> <span v-if="process.prore_pretenciones_indemnizacion != null">{{ formatPrice(process.prore_pretenciones_indemnizacion) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Pago de Seguridad Social en Salud:</strong> <span v-if="process.prore_pago_seguridad_social_sa != null">{{ formatPrice(process.prore_pago_seguridad_social_sa) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Salarios dejados de Percibir:</strong> <span v-if="process.prore_salario_dejados_percibir != null">{{ formatPrice(process.prore_salario_dejados_percibir) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Otros valores:</strong> <span v-if="process.prore_otros_valores != null">{{ formatPrice(process.prore_otros_valores) }}</span><span v-else> $ 0</span></b-card-text>
            <hr>
            <b-card-text class="mt-2 pt-3 text-left w-100"><h3><strong class="text-danger">TOTAL:</strong><span v-if="process.prore_cuantia_pretenciones == null"> $ 0 </span><span v-else> {{ formatPrice(process.prore_cuantia_pretenciones)}}  </span></h3></b-card-text>
            <hr>
              <b-card-text><strong>Estimación pago perjucios materiales:</strong> <span v-if="process.prore_estimacion_pago_perju_materiales != null">{{ formatPrice(process.prore_estimacion_pago_perju_materiales) }}</span><span v-else> $ 0</span></b-card-text>
              <b-card-text><strong>Estimación pago perjucios inmateriales:</strong> <span v-if="process.prore_estimacion_pago_perju_inmateriales != null">{{ formatPrice(process.prore_estimacion_pago_perju_inmateriales) }}</span><span v-else> $ 0</span></b-card-text>
              <b-card-text class="mt-2 pt-3 text-left w-100"><h3><strong class="text-danger">TOTAL ESTIMACIONES:</strong><span> {{ formatPrice(totalEstimaciones(process.prore_estimacion_pago_perju_materiales,process.prore_estimacion_pago_perju_inmateriales))}}  </span></h3></b-card-text>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row>
          <b-form-group class="col-md-6" label="Prestaciones Sociales" label-for="tempProrePrestacionesSociales">
            <vue-autonumeric class="form-control" v-model="tempProrePrestacionesSociales"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pretensiones por Vacaciones" label-for="tempProrePretencionesVacaciones">
            <vue-autonumeric class="form-control" v-model="tempProrePretencionesVacaciones"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pretensiones por Indemnización" label-for="tempProrePretencionesIndemnizacion">
            <vue-autonumeric class="form-control" v-model="tempProrePretencionesIndemnizacion"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pago de Seguridad Social en Salud" label-for="tempProreSeguridadSocialSa">
            <vue-autonumeric class="form-control" v-model="tempProreSeguridadSocialSa"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Salarios dejados de Percibir" label-for="tempProreSalariosDejadosPercibir">
            <vue-autonumeric class="form-control" v-model="tempProreSalariosDejadosPercibir"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Otros costos" label-for="tempProreValOtrosValores">
            <vue-autonumeric class="form-control" v-model="tempProreValOtrosValores"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Estimaciones Materiales" label-for="temProreEstimacionPagoPerjuMateriales">
            <vue-autonumeric class="form-control" v-model="temProreEstimacionPagoPerjuMateriales"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Estimaciones Inmateriales" label-for="temProreEstimacionPagoPerjuInmateriales">
            <vue-autonumeric class="form-control" v-model="temProreEstimacionPagoPerjuInmateriales"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
        </b-row>
      </div>
    </template>
    <template v-slot:footer>
      <div class="text-right">
        <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
        <b-button variant="primary" :disabled="process.prore_estado == 1" :class="estadoBotonActualizarCuantias" @click="editarProceso">{{ textoEditarCuantias }}</b-button>
      </div>
    </template>
  </iq-card>
</template>

<script>
import { xray } from '../../../../config/pluginInit.js'
import Vue from 'vue'
import axios from 'axios'
import VueAutonumeric from '../../../VueAutonumeric.vue'

export default {
  name: 'CostosCuantiasProcesoLaboral',
  components: {
    VueAutonumeric
  },
  props: ['prore_id', 'usr_id', 'process', 'user_profile'],
  mounted () {
    xray.index()
  },
  data () {
    return {
      optionNumeric: {
        digitGroupSeparator: ',',
        currencySymbol: '\u00a0$ ',
        currencySymbolPlacement: 'p',
        decimalPlaces: 0
      },
      tempProrePrestacionesSociales: 0,
      tempProrePretencionesVacaciones: 0,
      tempProrePretencionesIndemnizacion: 0,
      tempProreSeguridadSocialSa: 0,
      tempProreSalariosDejadosPercibir: 0,
      tempProreValOtrosValores: 0,
      temProreEstimacionPagoPerjuMateriales: 0,
      temProreEstimacionPagoPerjuInmateriales: 0,
      textoEditarCuantias: 'Editar Costos/Cuantías',
      estadoBotonActualizarCuantias: '',
      estadoBotonActualizarProceso: '',
      editando: false,
      profileProcessOptions: [{
        'code': 0,
        'label': 'No hay ningún dato'
      }]
    }
  },
  methods: {
    getProcess () {
      if (this.prore_id != null) {
        axios.get('/process/show/' + this.prore_id).then(res => {
          setTimeout(() => {
            if (res.data.process != null) {
              this.process = res.data.process[0]
            } else {
              Vue.swal('Ocurrió un error tratando de obtener los datos del proceso')
            }
          }, 1000)
        })
          .catch(this.errored = true)
          .finally(setTimeout(() => {
            this.loading = false
          }, 3500))
      }
    },
    setVariablesTemporales () {
      this.tempProrePrestacionesSociales = this.process.prore_prestaciones_sociales
      this.tempProrePretencionesVacaciones = this.process.prore_pretenciones_vacaciones
      this.tempProrePretencionesIndemnizacion = this.process.prore_pretenciones_indemnizacion
      this.tempProreSeguridadSocialSa = this.process.prore_pago_seguridad_social_sa
      this.tempProreSalariosDejadosPercibir = this.process.prore_salario_dejados_percibir
      this.tempProreValOtrosValores = this.process.prore_otros_valores
      this.temProreEstimacionPagoPerjuMateriales = this.process.prore_estimacion_pago_perju_materiales
      this.temProreEstimacionPagoPerjuInmateriales = this.process.prore_estimacion_pago_perju_inmateriales
    },
    editarProceso () {
      if (this.editando) {
        this.totalCuantiasPretenciones()
        this.estadoBotonActualizarProceso = 'disabled'
        this.estadoBotonActualizarCuantias = 'disabled'
        this.textoEditarCuantias = 'Actualizando...'
        setTimeout(() => {
          this.guardarProceso()
        }, 500)
      } else {
        this.setVariablesTemporales()
        if (this.profileProcessOptions[0] === '' || this.profileProcessOptions[0] == null) {
          this.fetchProfileProcessOptions()
        }
        this.textoEditarCuantias = 'Actualizar Proceso'
        this.editando = true
      }
    },
    fetchProfileProcessOptions () {
      axios.get('/profiles/fetch-profiles-process-requests').then(response => {
        this.profileProcessOptions = response.data.profiles
        this.intentos = 0
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchProfileProcessOptions()
          }
          this.intentos++
        })
    },
    guardarProceso () {
      if (this.usr_id != null && this.usr_id !== '') {
        this.process.prore_user_id = this.usr_id
      }
      axios.post('/process/updateInfoProceso/' + this.prore_id, this.process).then(res => {
        this.textoEditarProceso = 'Editar Proceso'
        this.estadoBotonActualizarProceso = ''
        this.estadoBotonActualizarCuantias = ''
        this.textoEditarCuantias = 'Editar Costos/Cuantías'
        if (res.data.status_code === 200) {
          setTimeout(() => {
            if (res.data.process != null) {
              this.process = res.data.process[0]
              this.textoEditarProceso = 'Editar Proceso'
              this.editando = false
              Vue.swal('Proceso actualizado correctamente')
            } else {
              this.editando = false
              Vue.swal('Ocurrió un errro tratando de obtener el proceso')
            }
          }, 1000)
        } else {
          this.textoEditarProceso = 'Guardar Proceso'
          Vue.swal('Error tratando de actualizar proceso. ' + res.data.message)
        }
      })
        .catch(error => {
          this.errores = error
          if (this.intentos < 2) {
            this.guardarProceso()
            this.intentos++
          } else {
            Vue.swal('Error tratando de actualizar proceso. ' + error)
            this.textoEditarProceso = 'Editar Proceso'
            this.estadoBotonActualizarProceso = ''
          }
        })
    },

    totalCuantiasPretenciones () {
      this.process.prore_prestaciones_sociales = this.tempProrePrestacionesSociales > 0 ? this.tempProrePrestacionesSociales : 0
      this.process.prore_pretenciones_vacaciones = this.tempProrePretencionesVacaciones > 0 ? this.tempProrePretencionesVacaciones : 0
      this.process.prore_pretenciones_indemnizacion = this.tempProrePretencionesIndemnizacion > 0 ? this.tempProrePretencionesIndemnizacion : 0
      this.process.prore_pago_seguridad_social_sa = this.tempProreSeguridadSocialSa > 0 ? this.tempProreSeguridadSocialSa : 0
      this.process.prore_salario_dejados_percibir = this.tempProreSalariosDejadosPercibir > 0 ? this.tempProreSalariosDejadosPercibir : 0
      this.process.prore_otros_valores = this.tempProreValOtrosValores > 0 ? this.tempProreValOtrosValores : 0
      this.process.prore_cuantia_pretenciones = this.process.prore_prestaciones_sociales +
                                                this.process.prore_pretenciones_vacaciones +
                                                this.process.prore_pretenciones_indemnizacion +
                                                this.process.prore_pago_seguridad_social_sa +
                                                this.process.prore_salario_dejados_percibir +
                                                this.process.prore_otros_valores
      this.process.prore_estimacion_pago_perju_materiales = this.temProreEstimacionPagoPerjuMateriales > 0 ? this.temProreEstimacionPagoPerjuMateriales : 0
      this.process.prore_estimacion_pago_perju_inmateriales = this.temProreEstimacionPagoPerjuInmateriales > 0 ? this.temProreEstimacionPagoPerjuInmateriales : 0
    },
    cancelarEdicionProceso () {
      this.textoEditarCuantias = 'Editar Costos/Cuantías'
      this.editando = false
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$ ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    totalEstimaciones (valor1, valor2) {
      if (valor1 === null && valor2 === null) {
        return 0
      } else if (valor1 === null) {
        return valor2
      } else if (valor2 === null) {
        return valor1
      } else {
        return valor1 + valor2
      }
    }
  }
}
</script>
