<template>
  <b-container fluid>
    <div class="py-5" v-if="loading">
      <b-progress :max="max" height="2rem">
        <b-progress-bar
          :progress_total="progress_total"
          variant="success"
          :style="{ width: progress_total + '%' }"
        >
          <span
            ><strong>{{ progress_total }}%</strong></span
          >
        </b-progress-bar>
      </b-progress>
    </div>
    <div v-else>
      <!-- MODAL DE EDITAR CASO -->
      <div>
        <b-modal id="modal-editar-tutela" size="lg" title="Editar Tutela" hide-footer>
          <EditarTutela
            :tutela="tutela"
            :onEdit="true"
            @reloadFunciont="obtenerTutela"
          />
        </b-modal>
      </div>
      <!-- FIN DE MODAL-->
      <b-row>
        <b-col lg="12">
          <iq-card body-class="p-0" style="margin-bottom: 5px;">
            <template v-slot:body>
              <div class="iq-edit-list">
                <tab-nav :pills="true" class="iq-edit-profile d-flex">
                  <tab-nav-items class="col-auto p-0" :active="true"  href="#informacion-general" title="Información general" />
                  <tab-nav-items class="col-auto p-0" :active="false" href="#etapas" title="Etapas Procesales" />
                  <tab-nav-items class="col-auto p-0" :active="false" href="#fallo" title="Fallo" />
                </tab-nav>
              </div>
            </template>
          </iq-card>
        </b-col>
        <encabezado-tutela :tutela="tutela"
          @emitirEditarTutela="editarTutela"
        />
      </b-row>
      <div class="iq-edit-list-data">
        <tab-content id="pills-tabContent-2">
          <tab-content-item :active="true" id="informacion-general">
            <descripcion-tutela
              :tutela="tutela"
            ></descripcion-tutela>
          </tab-content-item>
          <tab-content-item :active="false" id="etapas">
            <etapas-tutela
              :tutela="tutela"
            ></etapas-tutela>
          </tab-content-item>
          <tab-content-item :active="false" id="fallo">
            <etapas-tutela
              :tutela="tutela"
            ></etapas-tutela>
          </tab-content-item>
        </tab-content>
      </div>
    </div>
  </b-container>
</template>
<script>
import auth from '@/logic/auth'
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
import fileDownload from 'js-file-download'
import moment from 'moment'
import DescripcionTutela from './components/DescripcionTutela'
import EtapasTutela from './components/EtapasTutela'
import EncabezadoTutela from './components/EncabezadoTutela'
import EditarTutela from './components/EditarTutela'
moment.locale('es')
export default {
  name: 'MostrarTutela',
  components: {
    DescripcionTutela,
    EtapasTutela,
    EncabezadoTutela,
    EditarTutela
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Editar tutela',
      tutela: {},
      asignarProfiles: [1, 12],
      perfilesPermitidos: [1, 2],
      user_profile: null,
      progress_total: 4,
      max: 100,
      loading: true,
      agregarEtapa: false,
      etapasTutela: [],
      profesionalesOptions: [],
      textoBotonDescargarTutela: 'Descargar',
      estadoBotonDescargarTutela: ''
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
    xray.index()
    this.barraCargando()
    this.obtenerTutela()
    this.obtenerEtapasProcesales()
    this.user_profile = this.userLogged.user_profile
  },
  methods: {
    obtenerTutela () {
      this.$bvModal.hide('modal-editar-tutela')
      this.user_profile = this.userLogged.user_profile
      axios
        .get('tutelas/mostrar/' + this.$route.params.tutela_id)
        .then((res) => {
          this.tutela = res.data.tutela
        })
        .catch((err) => {
          this.errores = err
        })
        .finally(
          setTimeout(() => {
            this.loading = false
          }, 3000)
        )
    },
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    editarTutela (datos) {
      const fechaSolicitud = datos.tut_fecha_solicitud
      moment(fechaSolicitud).format('YYYY-MM-DD HH:mm:ss')
      datos.tut_fecha_solicitud = fechaSolicitud
      this.$bvModal.show('modal-editar-tutela')
    },
    obtenerEtapasProcesales () {
      this.agregarEtapaProcesal = false
      axios
        .get('/tutelas/etapas-tutela/' + this.$route.params.tutela_id)
        .then((res) => {
          if (res.status === 200) {
            this.etapasTutela = res.data.etapasTutela
          }
        })
    },
    onCancel () {
      this.agregarEtapa = false
    },
    formatFecha (fecha) {
      return moment(fecha).format('DD/MM/YYYY')
    },
    asignarTutela (tutela) {
      this.tutela = tutela
      this.$bvModal.show('modal-asignar-tutela')
    },
    cerrarModalAsignarTutela () {
      this.$bvModal.hide('modal-asignar-caso')
    },
    getProfesionals () {
      axios.get('/professionals/fetch').then((response) => {
        this.profesionalesOptions = response.data.professionals
      })
    },
    descargarTutela () {
      this.botonDescargarTutal = 'Descargando tutela...'
      this.estadoBotonDescargarTutela = 'disabled'
      axios({
        url: '/tutelas/descargar-tutela/' + this.tutela.tut_id,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        this.botonDescargarTutal = 'Descargar'
        this.estadoBotonDescargarTutela = ''
        fileDownload(response.data, 'tutela-' + this.formatearRadicado() + '.pdf')
      })
        .catch((err) => {
          this.botonDescargarTutal = 'Descargar'
          this.estadoBotonDescargarTutela = ''
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    }
  }
}
</script>
