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
            <b-card-text><strong>Daños Morales:</strong> <span v-if="process.prore_val_dano_moral != null">{{ formatPrice(process.prore_val_dano_moral) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Daño a la Vida ó Prejuicios Fisiologicos:</strong> <span v-if="process.prore_val_dano_vida != null">{{ formatPrice(process.prore_val_dano_vida) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Otros:</strong> <span v-if="process.prore_otros_valores != null">{{ formatPrice(process.prore_otros_valores) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
          </b-col>
          <b-col class="text-center" md="6">
            <b-card-title class="text-center">Perjuicios Materiales</b-card-title>
            <hr>
            <b-card-text><strong>Lucro Cesante:</strong> <span v-if="process.prore_val_luc_cesante != null">{{ formatPrice(process.prore_val_luc_cesante) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Daños Emergentes:</strong> <span v-if="process.prore_val_dano_emergente != null">{{ formatPrice(process.prore_val_dano_emergente) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
            <b-card-text><strong>Otros:</strong> <span v-if="process.prore_otros_valores != null">{{ formatPrice(process.prore_otros_valores) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
          </b-col>
        </b-row>
        <b-row>
              <b-card-text class="mr-4 mt-4 pt-3 text-center w-100"><h4><strong>TOTAL:</strong><span v-if="process.prore_cuantia_pretenciones == null"> $ 0 </span><span v-else> {{ formatPrice(process.prore_cuantia_pretenciones)}}  </span></h4></b-card-text>
            </b-row>
      </div>
      <div v-else>
        <b-row>
          <b-form-group class="col-md-6" label="Valor Daño Moral" label-for="prore_val_dano_moral">
            <vue-autonumeric class="form-control" v-model="process.prore_val_dano_moral"
              @keyup="totalPerjuiciosInmateriales"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <!-- materiales -->
          <b-form-group class="col-md-6" label="Valor Lucro Cesante" label-for="prore_val_luc_cesante">
            <vue-autonumeric class="form-control" v-model="process.prore_val_luc_cesante"
            @keyup="totalPerjuiciosMateriales"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Daño a la Vida ó Prejuicios Fisiologicos" label-for="prore_val_dano_vida">
            <vue-autonumeric class="form-control" v-model="process.prore_val_dano_vida"
              @keyup="totalPerjuiciosInmateriales"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <!-- materiales -->
          <b-form-group class="col-md-6" label="Valor Daño Emergente" label-for="prore_val_dano_emergente">
            <vue-autonumeric class="form-control" v-model="process.prore_val_dano_emergente"
              @keyup="totalPerjuiciosMateriales"
              :options="optionNumeric"
            ></vue-autonumeric>
          </b-form-group>
          <b-form-group class="col-md-6" label="Otros valores materiales e inmateriales" label-for="prore_otros_valores">
            <vue-autonumeric class="form-control" v-model="process.prore_otros_valores"
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
  props: ['prore_id', 'usr_id'],
  mounted () {
    xray.index()
    this.getProcess()
  },
  data () {
    return {
      optionNumeric: {
        digitGroupSeparator: ',',
        currencySymbol: '\u00a0$ ',
        currencySymbolPlacement: 'p',
        decimalPlaces: 0
      },
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
    totalPerjuiciosMateriales () {
      let valLucCesante = this.process.prore_val_luc_cesante > 0 ? this.process.prore_val_luc_cesante : 0
      let valDanoEmergente = this.process.prore_val_dano_emergente > 0 ? this.process.prore_val_dano_emergente : 0
      let valOtros = this.process.prore_otros_valores > 0 ? this.process.prore_otros_valores : 0
      this.process.prore_total_perjuicios_materiales = parseInt(valLucCesante) + parseInt(valDanoEmergente) + parseInt(valOtros)
      this.cuantiaPretensiones()
    },
    totalPerjuiciosInmateriales () {
      let valDanoMoral = this.process.prore_val_dano_moral > 0 ? this.process.prore_val_dano_moral : 0
      let valDanoVida = this.process.prore_val_dano_vida > 0 ? this.process.prore_val_dano_vida : 0
      this.process.prore_total_perjuicios_inmateriales = parseInt(valDanoMoral) + parseInt(valDanoVida)
      this.cuantiaPretensiones()
    },
    cuantiaPretensiones () {
      this.process.prore_cuantia_pretenciones = parseInt(this.process.prore_total_perjuicios_materiales) + parseInt(this.process.prore_total_perjuicios_inmateriales)
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
