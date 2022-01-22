<template>
  <iq-card class="p-2">
    <template v-slot:headerTitle>
      <h4 class="card-title">Proceso Laboral</h4>
    </template>
    <template v-slot:headerAction>
      <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
      <b-button variant="primary" :disabled="process.prore_estado == 1" :class="estadoBotonActualizarCuantias" @click="editarProceso">{{ textoEditarCuantias }}</b-button>
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
            <b-card-text><strong>Otros:</strong> <span v-if="process.prore_otros_valores != null">{{ formatPrice(process.prore_otros_valores) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text  class="text-center"><h3><strong>TOTAL:</strong> <span v-if="process.prore_cuantia_pretenciones  == null"> $ 0 </span><span v-else>{{ formatPrice(process.prore_cuantia_pretenciones) }}</span></h3></b-card-text>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row>
          <b-form-group class="col-md-6" label="Prestaciones Sociales" label-for="prore_prestaciones_sociales">
            <b-form-input @keyup="totalCuantiasPretenciones" v-model="process.prore_prestaciones_sociales" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pretensiones por Vacaciones" label-for="prore_pretenciones_vacaciones">
            <b-form-input @keyup="totalCuantiasPretenciones" id="prore_pretenciones_vacaciones" v-model="process.prore_pretenciones_vacaciones" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pretensiones por Indemnización" label-for="prore_pretenciones_indemnizacion">
            <b-form-input @keyup="totalCuantiasPretenciones" v-model="process.prore_pretenciones_indemnizacion" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pago de Seguridad Social en Salud" label-for="prore_pago_seguridad_social_sa">
            <b-form-input @keyup="totalCuantiasPretenciones" v-model="process.prore_pago_seguridad_social_sa" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Salarios dejados de Percibir" label-for="prore_salario_dejados_percibir">
            <b-form-input @keyup="totalCuantiasPretenciones" id="prore_salario_dejados_percibir" v-model="process.prore_salario_dejados_percibir" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Otros" label-for="prore_otros_valores">
            <b-form-input @keyup="totalCuantiasPretenciones" v-model="process.prore_otros_valores" type="number" placeholder="$"></b-form-input>
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

export default {
  name: 'CostosCuantiasProcesoLaboral',
  props: ['prore_id', 'usr_id'],
  mounted () {
    xray.index()
    this.getProcess()
  },
  data () {
    return {
      process: [],
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
    editarProceso () {
      if (this.editando) {
        this.guardarProceso()
        this.estadoBotonActualizarProceso = 'disabled'
        this.textoEditarProceso = 'Actualizando Proceso...'
        this.estadoBotonActualizarCuantias = 'disabled'
        this.textoEditarCuantias = 'Actualizando...'
      } else {
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
      let valPrestacionesSociales = this.process.prore_prestaciones_sociales > 0 ? this.process.prore_prestaciones_sociales : 0
      let valPretencionesVacaciones = this.process.prore_pretenciones_vacaciones > 0 ? this.process.prore_pretenciones_vacaciones : 0
      let valPretencionesIndemnizacion = this.process.prore_pretenciones_indemnizacion > 0 ? this.process.prore_pretenciones_indemnizacion : 0
      let valSeguridadSocial = this.process.prore_pago_seguridad_social_sa > 0 ? this.process.prore_pago_seguridad_social_sa : 0
      let valSalarioDejadoRecibir = this.process.prore_salario_dejados_percibir > 0 ? this.process.prore_salario_dejados_percibir : 0
      let valOtros = this.process.prore_otros_valores > 0 ? this.process.prore_otros_valores : 0
      this.process.prore_cuantia_pretenciones = parseInt(valPrestacionesSociales) +
                                                parseInt(valPretencionesVacaciones) +
                                                parseInt(valPretencionesIndemnizacion) +
                                                parseInt(valSeguridadSocial) +
                                                parseInt(valSalarioDejadoRecibir) +
                                                parseInt(valOtros)
    },
    cancelarEdicionProceso () {
      this.textoEditarProceso = 'Editar Proceso'
      this.editando = false
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$ ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
</script>
