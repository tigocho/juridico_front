<template>
  <iq-card class="p-2">
    <template v-slot:headerTitle>
      <h4 class="card-title">Proceso Ejecutivo</h4>
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
              <b-card-text><strong>Obligación:</strong> <span v-if="process.prore_cuantia_pretenciones != null">{{ formatPrice(process.prore_cuantia_pretenciones) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
              <b-card-text><strong>Otros:</strong> <span v-if="process.prore_otros_valores != null">{{ formatPrice(process.prore_otros_valores) }}</span><span class="text-danger" v-else> $ 0</span></b-card-text>
              <b-card-text class="text-center"><h3><strong>TOTAL:</strong> <span v-if="process.prore_otros_valores == null && process.prore_cuantia_pretenciones == null"> $ 0</span><span v-else>{{ formatPrice(process.prore_otros_valores + process.prore_cuantia_pretenciones) }}</span></h3></b-card-text>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row>
          <b-form-group class="col-md-6" label="Obligación" label-for="prore_cuantia_pretenciones">
            <b-form-input v-model="process.prore_cuantia_pretenciones" type="number" placeholder="$"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-6" label="Otros" label-for="prore_otros_valores">
            <b-form-input v-model="process.prore_otros_valores" type="number" placeholder="$"></b-form-input>
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
import iqCard from '../../../xray/cards/iq-card.vue'

export default {
  components: { iqCard },
  name: 'CostosCuantiasProcesoEjecutivo',
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
    totalPerjuiciosMateriales () {
      let valLucCesante = this.process.prore_val_luc_cesante > 0 ? this.process.prore_val_luc_cesante : 0
      let valDanoEmergente = this.process.prore_val_dano_emergente > 0 ? this.process.prore_val_dano_emergente : 0
      this.process.prore_total_perjuicios_materiales = parseInt(valLucCesante) + parseInt(valDanoEmergente)
      this.cuantiaPretensiones()
    },
    totalPerjuiciosInmateriales () {
      let valDanoMoral = this.process.prore_val_dano_moral > 0 ? this.process.prore_val_dano_moral : 0
      let valDanoVida = this.process.prore_val_dano_vida > 0 ? this.process.prore_val_dano_vida : 0
      this.process.prore_total_perjuicios_inmateriales = parseInt(valDanoMoral) + parseInt(valDanoVida)
      this.cuantiaPretensiones()
    },
    cuantiaPretensiones () {
      this.process.prore_cuantia_pretenciones = this.process.prore_total_perjuicios_materiales + this.process.prore_total_perjuicios_inmateriales
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
