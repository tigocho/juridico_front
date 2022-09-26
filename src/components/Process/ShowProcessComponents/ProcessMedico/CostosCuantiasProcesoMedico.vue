<template>
  <iq-card class="p-2">
    <template v-slot:headerTitle>
      <h4 class="card-title">Responsabilidad Médica</h4>
    </template>
    <template v-slot:headerAction>
      <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
      <b-button variant="primary" :disabled="process.prore_estado == 1" :class="estadoBotonActualizarCuantias" @click="editarProceso">{{ textoEditarCuantias }}</b-button>
    </template>
    <template v-slot:body>
      <div v-if="!editando">
        <b-row>
          <b-col class="text-center" md="6">
            <b-card-title class="text-center">Perjuicios Inmateriales</b-card-title>
            <hr>
            <b-card-text><strong>Daños Morales:</strong> <span v-if="process.prore_val_dano_moral != null">{{ formatPrice(process.prore_val_dano_moral) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Daño a la Vida ó Prejuicios Fisiologicos:</strong> <span v-if="process.prore_val_dano_vida != null">{{ formatPrice(process.prore_val_dano_vida) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Daño a la salud:</strong> <span v-if="process.prore_val_dano_salud != null">{{ formatPrice(process.prore_val_dano_salud) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Daño a los bienes constitucionales y convencionales:</strong> <span v-if="process.prore_val_dano_bienes_constitucionales_convencionales != null">{{ formatPrice(process.prore_val_dano_bienes_constitucionales_convencionales) }}</span><span v-else> $ 0</span></b-card-text>
          </b-col>
          <b-col class="text-center" md="6">
            <b-card-title class="text-center">Perjuicios Materiales</b-card-title>
            <hr>
            <b-card-text><strong>Lucro Cesante:</strong> <span v-if="process.prore_val_luc_cesante != null">{{ formatPrice(process.prore_val_luc_cesante) }}</span><span v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Daños Emergentes:</strong> <span v-if="process.prore_val_dano_emergente != null">{{ formatPrice(process.prore_val_dano_emergente) }}</span><span v-else> $ 0</span></b-card-text>
          </b-col>
        </b-row>
        <b-row>
          <b-card-text class="mr-4 mb-0 mt-4 pt-3 text-center w-100"><h5><strong>Otros valores:</strong><span v-if="process.prore_otros_valores == null"> $ 0 </span><span v-else> {{ formatPrice(process.prore_otros_valores)}}  </span></h5></b-card-text>
        </b-row>
        <hr>
        <b-row>
          <b-col class="text-center" md="6">
            <b-card-text><strong>TOTAL PRETENSIONES INMATERIALES:</strong> <span v-if="totalInmateriales != null">{{ formatPrice(totalInmateriales) }}</span><span v-else> $ 0</span></b-card-text>
          </b-col>
          <b-col class="text-center" md="6">
            <b-card-text><strong>TOTAL PRETENSIONES MATERIALES:</strong> <span v-if="totalMateriales != null">{{ formatPrice(totalMateriales) }}</span><span v-else> $ 0</span></b-card-text>
          </b-col>
        </b-row>
        <b-row>
          <b-card-text class="ml-4 mt-2 pt-3 text-left w-100"><h3><strong class="text-danger">TOTAL GENERAL:</strong><span v-if="process.prore_cuantia_pretenciones == null"> $ 0 </span><span v-else> {{ formatPrice(process.prore_cuantia_pretenciones)}}  </span></h3></b-card-text>
        </b-row>
        <hr>
        <b-row>
          <b-col class="text-center" md="6">
            <b-card-text><strong>Estimación pago perjucios inmateriales:</strong> <span v-if="process.prore_estimacion_pago_perju_inmateriales != null">{{ formatPrice(process.prore_estimacion_pago_perju_inmateriales) }}</span><span v-else> $ 0</span></b-card-text>
            </b-col>
            <b-col class="text-center" md="6">
            <b-card-text><strong>Estimación pago perjucios materiales:</strong> <span v-if="process.prore_estimacion_pago_perju_materiales != null">{{ formatPrice(process.prore_estimacion_pago_perju_materiales) }}</span><span v-else> $ 0</span></b-card-text>
            </b-col>
            <b-card-text class="mt-2 pt-3 text-left w-100"><h3><strong class="text-danger">TOTAL ESTIMACIONES:</strong><span> {{ formatPrice(totalEstimaciones(process.prore_estimacion_pago_perju_materiales,process.prore_estimacion_pago_perju_inmateriales))}}  </span></h3></b-card-text>
        </b-row>
      </div>
      <div v-else>
        <!-- editando -->
        <b-row>
          <b-form-group class="col-md-6" label="Valor Daño Moral" label-for="tempProreValDanoMoral">
            <vue-autonumeric class="form-control" v-model="tempProreValDanoMoral"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Valor Lucro Cesante" label-for="tempProreValLucCesante">
            <vue-autonumeric class="form-control" v-model="tempProreValLucCesante"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Daño a la Vida ó Prejuicios Fisiologicos" label-for="tempProreValDanoVida">
            <vue-autonumeric class="form-control" v-model="tempProreValDanoVida"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Valor Daño Emergente" label-for="tempProreValDanoEmergente">
            <vue-autonumeric class="form-control" v-model="tempProreValDanoEmergente"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Daño a la salud" label-for="tempProreValDanoSalud">
            <vue-autonumeric class="form-control" v-model="tempProreValDanoSalud"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Otros costos materiales e inmateriales" label-for="tempProreValOtrosValores">
            <vue-autonumeric class="form-control" v-model="tempProreValOtrosValores"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Daño a los bienes constitucionales y convencionales" label-for="tempProreValDanoBienesConstConv">
            <vue-autonumeric class="form-control" v-model="tempProreValDanoBienesConstConv"
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
  name: 'CostosCuantiasProcesoMedico',
  components: {
    VueAutonumeric
  },
  props: ['prore_id', 'usr_id', 'process'],
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
      textoEditarCuantias: 'Editar Costos/Cuantías',
      totalMateriales: 0,
      totalInmateriales: 0,
      tempProreValLucCesante: 0,
      tempProreValDanoMoral: 0,
      tempProreValDanoVida: 0,
      tempProreValDanoSalud: 0,
      tempProreValDanoBienesConstConv: 0,
      tempProreValDanoEmergente: 0,
      tempProreValOtrosValores: 0,
      temProreEstimacionPagoPerjuMateriales: 0,
      temProreEstimacionPagoPerjuInmateriales: 0,
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
              this.setTotales()
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
    setTotales () {
      this.totalMateriales = this.process.prore_val_luc_cesante + this.process.prore_val_dano_emergente
      this.totalInmateriales = this.process.prore_val_dano_moral + this.process.prore_val_dano_vida + this.process.prore_val_dano_salud + this.process.prore_val_dano_bienes_constitucionales_convencionales
    },
    setVariablesTemporales () {
      this.tempProreValLucCesante = this.process.prore_val_luc_cesante
      this.tempProreValDanoMoral = this.process.prore_val_dano_moral
      this.tempProreValDanoVida = this.process.prore_val_dano_vida
      this.tempProreValDanoSalud = this.process.prore_val_dano_salud
      this.tempProreValDanoBienesConstConv = this.process.prore_val_dano_bienes_constitucionales_convencionales
      this.tempProreValDanoEmergente = this.process.prore_val_dano_emergente
      this.tempProreValOtrosValores = this.process.prore_otros_valores
      this.temProreEstimacionPagoPerjuMateriales = this.process.prore_estimacion_pago_perju_materiales
      this.temProreEstimacionPagoPerjuInmateriales = this.process.prore_estimacion_pago_perju_inmateriales
    },
    editarProceso () {
      if (this.editando) {
        this.totalPerjuiciosMateriales()
        this.totalPerjuiciosInmateriales()
        this.cuantiaPretensiones()
        this.setTotales()
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
    totalPerjuiciosMateriales () {
      this.process.prore_val_luc_cesante = this.tempProreValLucCesante > 0 ? this.tempProreValLucCesante : 0
      this.process.prore_val_dano_emergente = this.tempProreValDanoEmergente > 0 ? this.tempProreValDanoEmergente : 0
      this.process.prore_otros_valores = this.tempProreValOtrosValores > 0 ? this.tempProreValOtrosValores : 0
      this.process.prore_total_perjuicios_materiales = this.process.prore_val_luc_cesante + this.process.prore_val_dano_emergente + this.process.prore_otros_valores
      this.process.prore_estimacion_pago_perju_materiales = this.temProreEstimacionPagoPerjuMateriales > 0 ? this.temProreEstimacionPagoPerjuMateriales : 0
      this.cuantiaPretensiones()
    },
    totalPerjuiciosInmateriales () {
      this.process.prore_val_dano_moral = this.tempProreValDanoMoral > 0 ? this.tempProreValDanoMoral : 0
      this.process.prore_val_dano_vida = this.tempProreValDanoVida > 0 ? this.tempProreValDanoVida : 0
      this.process.prore_val_dano_salud = this.tempProreValDanoSalud > 0 ? this.tempProreValDanoSalud : 0
      this.process.prore_val_dano_bienes_constitucionales_convencionales = this.tempProreValDanoBienesConstConv > 0 ? this.tempProreValDanoBienesConstConv : 0
      this.process.prore_total_perjuicios_inmateriales = this.process.prore_val_dano_moral + this.process.prore_val_dano_vida + this.process.prore_val_dano_salud + this.process.prore_val_dano_bienes_constitucionales_convencionales
      this.process.prore_estimacion_pago_perju_inmateriales = this.temProreEstimacionPagoPerjuInmateriales > 0 ? this.temProreEstimacionPagoPerjuInmateriales : 0
      this.cuantiaPretensiones()
    },
    cuantiaPretensiones () {
      this.process.prore_cuantia_pretenciones = parseInt(this.process.prore_total_perjuicios_materiales) + parseInt(this.process.prore_total_perjuicios_inmateriales)
    },
    cancelarEdicionProceso () {
      this.setVariablesTemporales()
      this.editando = false
      this.textoEditarCuantias = 'Editar Costos/Cuantías'
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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
