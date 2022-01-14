<template>
  <iq-card>
    <template v-slot:headerTitle>
      <h4 class="card-title">Proceso Laboral</h4>
    </template>
    <template v-slot:headerAction>
      <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
      <b-button variant="primary" :disabled="process.prore_estado == 1" :class="estadoBotonActualizarCuantias" @click="editarProceso">{{ textoEditarCuantias }}</b-button>
    </template>
    <template v-slot:body>
      <div v-if="!editando">
        <b-row>
          <b-col md="12">
            <b-card-title class="text-center">Pretensiones económicas</b-card-title>
            <hr>
            <b-card-text><strong>Prestaciones Sociales:</strong> <span v-if="process.prore_prestaciones_sociales != null">{{ formatPrice(process.prore_prestaciones_sociales) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
            <b-card-text><strong>Pretensiones por Vacaciones:</strong> <span v-if="process.prore_pretenciones_vacaciones != null">{{ formatPrice(process.prore_pretenciones_vacaciones) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
            <b-card-text><strong>Indemnización por despido sin justa causa:</strong> <span v-if="process.prore_pretenciones_indemnizacion != null">{{ formatPrice(process.prore_pretenciones_indemnizacion) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
            <b-card-text><strong>Pago de Seguridad Social en Salud:</strong> <span v-if="process.prore_pago_seguridad_social_sa != null">{{ formatPrice(process.prore_pago_seguridad_social_sa) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
            <b-card-text><strong>Sanción por pago tardío de prestaciones sociales:</strong> <span v-if="process.prore_prestaciones_sociales != null">{{ formatPrice(process.prore_prestaciones_sociales) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
            <b-card-text><strong>Salarios dejados de Percibir:</strong> <span v-if="process.prore_salario_dejados_percibir != null">{{ formatPrice(process.prore_salario_dejados_percibir) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
            <b-card-text><strong>Otros:</strong> <span v-if="process.prore_otros_valores != null">{{ formatPrice(process.prore_otros_valores) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
            <b-card-text><strong>TOTAL:</strong> <span v-if="process.prore_prestaciones_sociales == null && process.prore_pretenciones_vacaciones != null && process.prore_pretenciones_indemnizacion != null && process.prore_pago_seguridad_social_sa != null && process.prore_prestaciones_sociales != null && process.prore_salario_dejados_percibir != null && process.prore_otros_valores != null"> 0 </span><span v-else>{{ formatPrice(process.prore_prestaciones_sociales + process.prore_pretenciones_vacaciones + process.prore_pago_seguridad_social_sa + process.prore_salario_dejados_percibir + process.prore_otros_valores) }}</span></b-card-text>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row>
          <b-form-group class="col-md-6" label="Pretensiones/Capital/Interes/Honorarios" label-for="prore_pretenciones_cap_int_hon">
            <b-form-input v-model="process.prore_pretenciones_cap_int_hon" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pretensiones Laborales" label-for="prore_pretenciones_laborales">
            <b-form-input v-model="process.prore_pretenciones_laborales" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Estimado a Pagar Por Perjuicios Mat." label-for="prore_estimacion_pago_perju_materiales">
            <b-form-input v-model="process.prore_estimacion_pago_perju_materiales" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Prestaciones Sociales" label-for="prore_prestaciones_sociales">
            <b-form-input v-model="process.prore_prestaciones_sociales" type="number" placeholder="$"></b-form-input>
            </b-form-group>
          <b-form-group class="col-md-6" label="Pretensiones por Vacaciones" label-for="prore_pretenciones_vacaciones">
            <b-form-input id="prore_pretenciones_vacaciones" v-model="process.prore_pretenciones_vacaciones" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pretensiones por Indemnización" label-for="prore_pretenciones_indemnizacion">
            <b-form-input v-model="process.prore_pretenciones_indemnizacion" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Pago de Seguridad Social en Salud" label-for="prore_pago_seguridad_social_sa">
            <b-form-input v-model="process.prore_pago_seguridad_social_sa" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Salarios dejados de Percibir" label-for="prore_salario_dejados_percibir">
            <b-form-input id="prore_salario_dejados_percibir" v-model="process.prore_salario_dejados_percibir" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Otros" label-for="prore_otros_valores">
            <b-form-input v-model="process.prore_otros_valores" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Valor Lucro Cesante" label-for="prore_val_luc_cesante">
            <b-form-input @keyup="totalPerjuiciosMateriales" v-model="process.prore_val_luc_cesante" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Valor Daño Emergente" label-for="prore_val_dano_emergente">
            <b-form-input @keyup="totalPerjuiciosMateriales" v-model="process.prore_val_dano_emergente" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Total Perjuicios Materiales" label-for="prore_total_perjuicios_materiales">
            <b-form-input id="prore_total_perjuicios_materiales" v-model="process.prore_total_perjuicios_materiales" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Estimado a Pagar Por Perjuicios Materiales" label-for="prore_estimacion_pago_perju">
            <b-form-input id="prore_estimacion_pago_perju_materiales" v-model="process.prore_estimacion_pago_perju_materiales" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Valor Daño Moral" label-for="prore_val_dano_moral">
            <b-form-input @keyup="totalPerjuiciosInmateriales" v-model="process.prore_val_dano_moral" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Daño a la Vida ó Prejuicios Fisiologicos y Otros" label-for="prore_val_dano_vida">
            <b-form-input @keyup="totalPerjuiciosInmateriales" v-model="process.prore_val_dano_vida" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Total Perjuicios Inmateriales" label-for="prore_total_perjuicios_inmateriales">
            <b-form-input v-model="process.prore_total_perjuicios_inmateriales" type="number" disabled="disabled" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Estimado Del Monto A Pagar Por Perjuicios Inmateriales" label-for="prore_estimacion_pago_perju_inmateriales">
            <b-form-input id="prore_estimacion_pago_perju_inmateriales" v-model="process.prore_estimacion_pago_perju_inmateriales" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Cuantía de las Pretensiones" label-for="prore_cuantia_pretenciones">
            <b-form-input id="prore_cuantia_pretenciones" v-model="process.prore_cuantia_pretenciones" disabled="disabled" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Valor a Provisionar" label-for="prore_valor_provisionar">
            <b-form-input id="prore_valor_provisionar" v-model="process.prore_valor_provisionar" type="number" placeholder="$"></b-form-input>
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
import { xray } from '../../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'

export default {
  name: 'CostosCuantiasProcesoLaboral',
  props: ['prore_id', 'editando'],
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
      textoEditarProceso: 'Editar Proceso'
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
      // this.$router.push({ path: `/process/process-edit/` + this.prore_id })
      if (this.editando) {
        console.log('EDITANDOOOOO')
        this.guardarProceso()
        this.estadoBotonActualizarProceso = 'disabled'
        this.textoEditarProceso = 'Actualizando Proceso...'
        this.estadoBotonActualizarCuantias = 'disabled'
        this.textoEditarCuantias = 'Actualizando...'
      } else {
        if (this.profileProcessOptions[0] === '' || this.profileProcessOptions[0] == null) {
          this.fetchProfileProcessOptions()
        }
        this.textoEditarProceso = 'Actualizar Proceso'
        this.editando = true
      }
    },
    cancelarEdicionProceso () {
      this.textoEditarProceso = 'Editar Proceso'
      this.editando = false
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
</script>
