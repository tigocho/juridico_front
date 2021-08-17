<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Crear/Actualizar procesos con Excel </h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col sm="12" md="12" class="my-1">
                <b-card-text>Si es una actualización, el número de proceso debe de coincidir con la primera columna del Excel</b-card-text>
              </b-col>
              <b-col sm="6" md="6" class="my-1">
                <b-form-group ref="addProcess" label-for="exampleFormControlFile1" label="Subir archivo de Excel">
                  <b-form-file id="input-file-import" :class="{ ' is-invalid' : error.message }"
                  name="file_import" ref="import_file" @change="onFileChange"></b-form-file>
                </b-form-group>
                <div v-if="error.message" class="invalid-feedback">
                </div>
                <b-button variant="primary" @click="importarArchivo" :class="estadoBotonImportar" >{{ botonEjecutarImportacion }}</b-button>
              </b-col>
            </b-row>
            <b-row v-if="error.errores != null" :key="keyErrores">
              <b-col sm="12" md="12" class="my-1">
                <p>Se encontraron los siguientes erorres. <b>Nota: Los proceso que no tuvieron error, fueron importados exitosamente.</b></p>
                 <b-table :items="error.errores" :fields="columnasErorres" stacked="md" small>
                  <template v-slot:cell(attribute)="data">
                    <span>{{ nombreColumnaProcesos(data.item.attribute) }}</span>
                  </template>
                  <template v-slot:cell(row)="data">
                    <span>{{ data.item.row }}</span>
                  </template>
                  <template v-slot:cell(errors)="data">
                    <span v-for="(error_proceso, index) in data.item.errors" :key="index">{{ error_proceso }}</span>
                  </template>
                  <template v-slot:cell(values)="data">
                    <span>{{ data.item.values[data.item.attribute] }}</span>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Importar involucrados</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col sm="6" md="6" class="my-1">
                <b-form-group label-for="importar-involucrados" label="Subir archivo de involucrados">
                  <b-form-file id="importar-involucrados"
                  name="implicated_file" ref="implicated_file" @change="onFileChangeImplicated"></b-form-file>
                </b-form-group>
                <b-button variant="primary" @click="importarArchivoImplicated" :class="estadoBotonImportarImplicated" >{{ botonEjecutarImportacionImplicated }}</b-button>
              </b-col>
            </b-row>
            <b-row v-if="errorImplicated.errores != null" :key="keyErroresImplicated">
              <b-col sm="12" md="12" class="my-1">
                <p>Se encontraron los siguientes erorres. <b>Nota: Los involucrados que no tuvieron error, fueron importados exitosamente.</b></p>
                 <b-table :items="errorImplicated.errores" :fields="columnasErorres" stacked="md" small>
                  <template v-slot:cell(attribute)="data">
                    <span>{{ nombreColumnaImplicated(data.item.attribute) }}</span>
                  </template>
                  <template v-slot:cell(row)="data">
                    <span>{{ data.item.row }}</span>
                  </template>
                  <template v-slot:cell(errors)="data">
                    <span v-for="(error_proceso, index) in data.item.errors" :key="index">{{ error_proceso }}</span>
                  </template>
                  <template v-slot:cell(values)="data">
                    <span>{{ data.item.values[data.item.attribute] }}</span>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
import auth from '@/logic/auth'
import iqCard from '../../components/xray/cards/iq-card.vue'

export default {
  components: { iqCard },
  name: 'ProfileEdit',
  mounted () {
    xray.index()
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  data () {
    return {
      estadoBotonImportar: '',
      estadoBotonImportarImplicated: '',
      botonEjecutarImportacion: 'Ejecutar Importación',
      botonEjecutarImportacionImplicated: 'Ejecutar Importación',
      import_file: null,
      implicated_file: null,
      error: {},
      errorImplicated: {},
      keyErrores: 1,
      columnasErorres: [
        { key: 'attribute', label: 'Columna', class: 'text-left' },
        { key: 'row', label: 'Fila', class: 'text-left' },
        { key: 'errors', label: 'Error', class: 'text-center' },
        { key: 'values', label: 'Valor ingresado', class: 'text-center' }
      ]
    }
  },
  methods: {
    onFileChange (e) {
      this.import_file = e.target.files[0]
    },
    onFileChangeImplicated (e) {
      this.implicated_file = e.target.files[0]
    },
    importarArchivo () {
      if (this.import_file != null) {
        this.estadoBotonImportar = 'disabled'
        this.botonEjecutarImportacion = 'Importando...'
        let formData = new FormData()
        formData.append('import_file', this.import_file)
        var user = JSON.parse(auth.getUserLogged())
        this.user_id = user.usr_id
        const token = localStorage.getItem('access_token')
        axios.post('/process/importar-nuevos-procesos', formData, {
          headers: { 'Authorization': token }
        })
          .then(response => {
            this.$refs.import_file.reset()
            this.$refs.import_file.value = null
            this.import_file = null
            this.keyErrores++
            this.error = {}
            if (response.data.status_code === 200) {
              this.estadoBotonImportar = ''
              this.botonEjecutarImportacion = 'Ejecutar Importación'
              Vue.swal('Archivo importado exitosamente.')
            } else {
              // estatus code != 200 code here when an upload is not valid
              this.$refs.import_file.reset()
              this.$refs.import_file.value = null
              this.import_file = null
              this.keyErrores++
              this.estadoBotonImportar = ''
              this.botonEjecutarImportacion = 'Ejecutar Importación'
              this.uploading = false
              this.error = response.data
            }
          })
          .catch(error => {
            // code here when an upload is not valid
            this.$refs.import_file.reset()
            this.$refs.import_file.value = null
            this.import_file = null
            this.keyErrores++
            this.estadoBotonImportar = ''
            this.botonEjecutarImportacion = 'Ejecutar Importación'
            this.uploading = false
            this.error = error.response.data
          })
      } else {
        Vue.swal('Por favor elige un archivo')
      }
    },
    importarArchivoImplicated () {
      if (this.implicated_file != null) {
        this.estadoBotonImportarImplicated = 'disabled'
        this.botonEjecutarImportacionImplicated = 'Importando...'
        let formData = new FormData()
        formData.append('implicated_file', this.implicated_file)
        var user = JSON.parse(auth.getUserLogged())
        this.user_id = user.usr_id
        const token = localStorage.getItem('access_token')
        axios.post('/implicateds/importar-nuevos-implicateds', formData, {
          headers: { 'Authorization': token }
        })
          .then(response => {
            this.$refs.implicated_file.reset()
            this.$refs.implicated_file.value = null
            this.keyErroresImplicated++
            this.errorImplicated = {}
            if (response.data.status_code === 200) {
              this.estadoBotonImportarImplicated = ''
              this.botonEjecutarImportacionImplicated = 'Ejecutar Importación'
              Vue.swal('Archivo importado exitosamente.')
            } else {
              this.keyErroresImplicated++
              this.$refs.implicated_file.reset()
              this.$refs.implicated_file.value = null
              this.implicated_file = null
              this.estadoBotonImportarImplicated = ''
              this.botonEjecutarImportacionImplicated = 'Ejecutar Importación'
              this.uploading = false
              this.errorImplicated = response.data
            }
          })
          .catch(error => {
            // code here when an upload is not valid
            this.keyErroresImplicated++
            this.$refs.implicated_file.reset()
            this.$refs.implicated_file.value = null
            this.implicated_file = null
            this.estadoBotonImportarImplicated = ''
            this.botonEjecutarImportacionImplicated = 'Ejecutar Importación'
            this.uploading = false
            this.errorImplicated = error.response.data
          })
      } else {
        Vue.swal('Por favor elige un archivo')
      }
    },
    nombreColumnaProcesos (attribute) {
      if (attribute === '0') {
        return 'Número de proceso'
      } else if (attribute === '1') {
        return 'Responsable diligencia cuadro'
      } else if (attribute === '2') {
        return 'Clinica/ IPS'
      } else if (attribute === '3') {
        return 'Año del siniestro'
      } else if (attribute === '4') {
        return 'Año de notificación'
      } else if (attribute === '5') {
        return 'Diferencia años entre el siniestro y notificación'
      } else if (attribute === '6') {
        return 'Año del proceso'
      } else if (attribute === '7') {
        return 'Ciudad'
      } else if (attribute === '11') {
        return 'Número de radicado'
      } else if (attribute === '14') {
        return 'Etapa procesal'
      } else if (attribute === '18') {
        return 'Valor lucro cesante en la demanda'
      } else if (attribute === '19') {
        return 'Valor daño emergente en la demanda'
      } else if (attribute === '20') {
        return 'Total perjuicios materiales en la demanda'
      } else if (attribute === '21') {
        return 'Valor que cubre la poliza por lucro cesante'
      } else if (attribute === '22') {
        return 'Total perjuicios mat. cubre la poliza'
      } else if (attribute === '23') {
        return 'Valor que cubre la póliza por daño emergente  '
      } else if (attribute === '24') {
        return 'Estimación monto a pagar perjuicios mat.'
      } else if (attribute === '25') {
        return 'Valor daño moral en la demanda'
      } else if (attribute === '26') {
        return 'Daño a la vida en la demanda'
      } else if (attribute === '27') {
        return 'Total perjuicios inmat. indicados en la demanda'
      } else if (attribute === '28') {
        return 'Valor que cubre la póliza por daño moral'
      } else if (attribute === '29') {
        return 'Daño a la vida en relación indicado o perjuicio fisiológicos que cubre la póliza'
      } else if (attribute === '30') {
        return 'Total perjuicios inmat. cubre la poliza'
      } else if (attribute === '31') {
        return 'Estimación monto a pagar perjuicios inmat.'
      } else if (attribute === '32') {
        return ' Cuantía de las pretensiones en la demanda'
      } else if (attribute === '34') {
        return ' Costas primera instancia'
      } else if (attribute === '35') {
        return 'Costas segunda instancia'
      } else if (attribute === '36') {
        return 'Total Costas'
      } else if (attribute === '37') {
        return 'Total sentencia perjuicios inmat.'
      } else if (attribute === '38') {
        return 'Total sentencia perjuicios mat.'
      } else if (attribute === '39') {
        return ' Total pagado clinica '
      } else if (attribute === '40') {
        return 'Total pagado aseguradora'
      } else if (attribute === '41') {
        return 'Total pagado por tercero'
      } else if (attribute === '42') {
        return 'Total sentencia'
      } else if (attribute === '45') {
        return 'Monto total asegurado'
      } else if (attribute === '46') {
        return 'Si la póliza fue afectada, por que valor'
      } else if (attribute === '47') {
        return 'Deducible'
      } else if (attribute === '49') {
        return 'Cobertura actual de la poliza'
      } else if (attribute === '50') {
        return 'Provisiones constituidas'
      } else if (attribute === '54') {
        return 'Fecha fin del proceso'
      } else {
        return 'No especificado'
      }
    },
    nombreColumnaImplicated (attribute) {
      if (attribute === '0') {
        return 'Número de proceso'
      } else if (attribute === '3') {
        return 'Nombre completo/Persona jurídica'
      } else if (attribute === '4') {
        return 'Perfil'
      } else {
        return 'No especificado'
      }
    },
    tipoIdentificacion (tipoIdentificacionId) {
      if (tipoIdentificacionId === 1) {
        return 'C.C'
      } else if (tipoIdentificacionId === 2) {
        return 'T.I'
      } else if (tipoIdentificacionId === 3) {
        return 'C.C'
      } else if (tipoIdentificacionId === 4) {
        return 'NIT '
      }
    }
  }
}
</script>
