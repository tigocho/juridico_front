<template>
  <b-container fluid>
    <section>
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
          <b-modal
            id="modal-editar-caso"
            size="lg"
            title="Editar Caso"
            hide-footer
          >
            <FormCase
              :case_id="caso.caso_id"
              :case_title="caso.caso_titulo"
              :case_description="caso.caso_descripcion"
              :case_clinica_id="caso.caso_clinica_id"
              :case_actividad_id="caso.act_id"
              :case_subactividad_id="caso.caso_subact_id"
              :case_fecha_solicitud="caso.caso_fecha_solicitud"
              :onEdit="true"
              :reloadFunciont="this.getCase"
              :archivosCaso="archivos"
              :archivosSeguimiento="archivosSeguimiento"
            />
          </b-modal>
        </div>
        <!-- FIN DE MODAL-->
        <!-- MODAL DE ASIGNAR CASO -->
        <div>
          <b-modal
            id="modal-asignar-caso"
            size="lg"
            title="Asignar Caso"
            hide-footer
          >
            <ValidationObserver ref="form-2" v-slot="{ handleSubmit }">
              <form
                ref="form-2"
                @submit.prevent="handleSubmit(SaveAsignacionCaso)"
              >
                <b-row>
                  <b-col lg="10" class="pagina-detalle-proceso">
                    <b-card-text style="margin-left: 15px">
                      <b-row>
                        <strong>Actividad: </strong>&nbsp;
                        {{ caso.actividad }}&nbsp;
                        <strong>Subactividad: </strong>&nbsp;
                        {{ caso.subactividad }} </b-row
                      ><b-row>
                        <strong>Asunto: </strong>&nbsp;
                        {{ caso.caso_titulo }} </b-row
                      ><b-row>
                        <strong>Descripcion: </strong>&nbsp;
                        {{ caso.caso_descripcion }}
                      </b-row>
                    </b-card-text>
                    <b-form-group label="Abogado*" label-for="profesional_id">
                      <v-select
                        v-model="asginarData.profesional_id"
                        :options="profesionalesOptions"
                        :reduce="(label) => label.code"
                        label="label"
                        id="profesional_id"
                      >
                        <span slot="no-options">No hay Abogados.</span>
                      </v-select>
                    </b-form-group>
                    <b-form-group>
                      <b-button variant="primary" type="submit"
                        >Asignar Caso</b-button
                      >
                    </b-form-group>
                  </b-col>
                </b-row>
              </form>
            </ValidationObserver>
          </b-modal>
        </div>
        <!-- FIN DE MODAL-->
        <b-row>
          <b-col lg="12">
            <iq-card body-class="p-0">
              <template v-slot:body>
                <div class="iq-edit-list">
                  <tab-nav :pills="true" class="iq-edit-profile d-flex">
                    <tab-nav-items
                      class="col-auto p-0"
                      :active="true"
                      href="#información-general"
                      title="Información General"
                    />
                    <tab-nav-items
                      class="col-auto p-0"
                      :active="false"
                      href="#seguimiento"
                      title="Seguimiento"
                    />
                    <tab-nav-items
                      class="col-auto p-0"
                      disabled
                      :active="false"
                      href="#historial"
                      title="Historial"
                    />
                    <tab-nav-items
                      class="col-auto p-0"
                      disabled
                      :active="false"
                      href="#archivos"
                      :title="
                        cantidadArchivos > 0
                          ? 'Archivos (' + cantidadArchivos + ')'
                          : 'Archivos'
                      "
                    />
                  </tab-nav>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="12" class="pagina-detalle-caso">
            <div class="iq-edit-list-data">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="información-general">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h5 class="card-title">
                        Radicado interno
                        {{ formatearRadicado() }}
                        <b-button
                        v-if="
                          asignarProfiles.includes(user_profile) &&
                          caso.abogado === 'Por Asignar'
                        "
                        variant="secondary"
                        @click="asignarCaso(caso)"
                        >Asignar Caso</b-button
                      >
                      <span v-else>
                        <b-badge variant="warning" class="mr-1">
                          <i class="ri-time-fill"></i>
                          {{ caso.estado }}</b-badge
                        >
                      </span>
                      </h5>
                    </template>
                    <template v-slot:headerAction>
                      <b-button
                        variant="success"
                        style="margin-right: 5px"
                      >
                        <i class="ri-printer-line"></i>Imprimir
                      </b-button>
                      <b-button
                        variant="primary"
                        v-if="caso.est_id !== 4"
                        style="margin-left: 5px"
                        @click="editarCaso"
                        >Editar Caso</b-button
                      >
                    </template>
                    <template v-slot:body>
                      <b-card-text>
                        <b-row>
                          <b-col
                            ><strong>Fecha de apertura: </strong>
                            {{ fechaLegibleUsuario(caso.caso_fecha_solicitud) }}</b-col
                          >
                        </b-row>
                        <b-row v-if="
                          perfilesPermitidosVerHorasInvertidas.includes(user_profile) &&
                          caso.est_id === 4
                        ">
                          <b-col
                            ><strong>Tiempo invertido: </strong>
                            <span style="text-decoration: underline;">{{ convertirHorasInvertidas(caso.caso_horas_invertidas) }}</span></b-col
                          >
                          <b-col cols="6"
                            ><strong>Tiempo de Solución: </strong>
                            {{ caso.fecha_solucion }}
                          </b-col>
                          <b-col
                            ><strong>Título: </strong>
                            {{ caso.caso_titulo }}</b-col
                          >
                        </b-row>
                        <b-row v-else>
                          <b-col
                            ><strong>Título: </strong>
                            {{ caso.caso_titulo }}</b-col
                          >
                          <b-col cols="6"
                            ><strong>Tiempo de Solución: </strong>
                            {{ caso.fecha_solucion }}
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col
                            ><strong>Solicitante: </strong>
                            {{ caso.solicitante }}</b-col
                          >
                          <b-col cols="6"
                            ><strong>Tiempo restante: </strong>
                            {{ caso.tiempo_faltante_ans }}
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col>
                            <strong>Cliente: </strong> {{ caso.cli_name }}
                          </b-col>
                          <b-col cols="6"
                            ><strong>Abogado: </strong> {{ caso.abogado }}
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col cols="6">
                            <strong>Tipo de Actividad: </strong>
                            {{ caso.subactividad }}
                          </b-col>
                          <b-col cols="6">
                            <strong>Medio de Solicitud: </strong>
                            {{ caso.med_sol_nombre }}
                          </b-col>
                          <b-col v-if="caso.caso_process_request_id !== null" cols="6">
                            <strong>Radicado de proceso: </strong>
                            {{ caso.prore_num_radicado }}
                            <span @click="irAProceso" style="text-decoration:underline;cursor:pointer;">ir <i class="ri-arrow-right-line"></i></span>
                          </b-col>
                        </b-row>
                      </b-card-text>
                      <b-card-text>
                        <strong>Descripción </strong>
                        <p>{{ caso.caso_descripcion }}</p>
                      </b-card-text>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="seguimiento">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="text-dark">Seguimiento</h4>
                      <encabezado-caso
                        :casoId="formatearRadicado()"
                        :solicitante="caso.solicitante"
                        :fechaHora="fechaLegibleUsuario(caso.caso_fecha_solicitud)"
                      ></encabezado-caso>
                    </template>
                    <template v-slot:body>
                      <div v-if="addSeguimiento">
                        <FormSegumiento
                          :case_id="caso.caso_id"
                          :onCreate="getSeguimientos"
                          :onCancel="onCancel"
                        />
                      </div>
                      <div v-else>
                        <b-button
                        v-if="caso.est_id !== 4"
                          style="margin-left: 25px; margin-bottom: 20px"
                          variant="primary"
                          @click="addSeguimiento = true"
                          ><em class="fa fa-plus"></em> Agregar
                          Seguimiento</b-button
                        >
                        <div
                          style="margin-top: 10px"
                          v-for="(seguimiento, index) in seguimientosCaso"
                          :key="index"
                        >
                          <div
                            v-if="
                              seguimiento.seg_usuario_id ===
                              caso.caso_usuario_id
                            "
                          >
                            <b-row>
                              <b-col
                                style="margin-top: 15px; margin-left: 45px"
                              >
                                <b-card-text
                                  ><b-row
                                    ><strong>{{
                                      seguimiento.usuario
                                    }}</strong></b-row
                                  >
                                  <b-row>{{
                                    formatFecha(seguimiento.seg_fecha)
                                  }}</b-row>
                                </b-card-text>
                              </b-col>
                              <b-col cols="9" style="margin-right: 75px"
                                ><b-card
                                  :style="
                                    seguimiento.seg_tipo_seg_id === 2
                                      ? 'background-color: #152265'
                                      : seguimiento.seg_tipo_seg_id === 3
                                      ? 'background-color: #2E86C1'
                                      : seguimiento.seg_tipo_seg_id === 4
                                      ? 'background-color: #EC7063'
                                      : seguimiento.seg_tipo_seg_id === 5
                                      ? 'background-color: #8E44AD'
                                      : 'background-color: #F1C40F'
                                  "
                                  class="card-border"
                                  :title="seguimiento.seg_titulo"
                                >
                                  <b-card-text class="text-white">{{
                                    seguimiento.seg_descripcion
                                  }}</b-card-text
                                  ><div
                        style="margin-top: 10px"
                        v-for="(archivo, index) in archivosSeguimiento"
                        :key="archivo.arch_seg_id + index"
                      >
                        <b-card-text class="text-white" v-if="archivo.arch_seg_seg_id === seguimiento.seg_id">
                          <b-col>
                            <span
                              :style="'text-decoration: underline;cursor: pointer;'"
                              @click="
                                descargarArchivoSeguimiento(
                                  archivo.arch_seg_nombre,
                                  archivo.arch_seg_id
                                )
                              "
                              v-b-tooltip.hover
                              title="Descargar archivo"
                              >{{ archivo.arch_seg_nombre }}</span>
                          </b-col>
                        </b-card-text>
                      </div><b-card-text
                                    class="text-right text-white font-italic"
                                    >{{
                                      seguimiento.tipo_seg_nombre
                                    }}</b-card-text
                                  >
                                </b-card></b-col
                              >
                            </b-row>
                          </div>
                          <div v-else>
                            <b-row>
                              <b-col cols="8" style="margin-left: 25px"
                                ><b-card
                                  :style="
                                    seguimiento.seg_tipo_seg_id === 2
                                      ? 'background-color: #152265'
                                      : seguimiento.seg_tipo_seg_id === 3
                                      ? 'background-color: #2E86C1'
                                      : seguimiento.seg_tipo_seg_id === 4
                                      ? 'background-color: #EC7063'
                                      : seguimiento.seg_tipo_seg_id === 5
                                      ? 'background-color: #8E44AD'
                                      : 'background-color: #F1C40F'
                                  "
                                  :title="seguimiento.seg_titulo"
                                  class="card-border"
                                >
                                  <b-card-text class="text-white">{{
                                    seguimiento.seg_descripcion
                                  }}</b-card-text><div
                        style="margin-top: 10px"
                        v-for="(archivo, index) in archivosSeguimiento"
                        :key="archivo.arch_seg_id + index"
                      >
                        <b-card-text class="text-white" v-if="archivo.arch_seg_seg_id === seguimiento.seg_id">
                          <b-col>
                            <span
                              :style="'text-decoration: underline;cursor: pointer;'"
                              @click="
                                descargarArchivoSeguimiento(
                                  archivo.arch_seg_nombre,
                                  archivo.arch_seg_id
                                )
                              "
                              v-b-tooltip.hover
                              title="Descargar archivo"
                              >{{ archivo.arch_seg_nombre }}</span>
                          </b-col>
                        </b-card-text>
                      </div>
                                  <b-card-text
                                    class="text-right text-white font-italic"
                                    >{{
                                      seguimiento.tipo_seg_nombre
                                    }}</b-card-text
                                  >
                                </b-card></b-col
                              >
                              <b-col
                                style="margin-top: 15px; margin-left: 15px"
                              >
                                <b-card-text
                                  ><b-row
                                    ><strong>{{
                                      seguimiento.usuario
                                    }}</strong></b-row
                                  >
                                  <b-row>{{
                                    formatFecha(seguimiento.seg_fecha)
                                  }}</b-row>
                                </b-card-text>
                              </b-col>
                            </b-row>
                          </div>
                        </div>
                        <div style="margin-top: 10px">
                          <b-row>
                            <b-col style="margin-top: 15px; margin-left: 45px"
                              ><b-card-text
                                ><b-row
                                  ><strong>{{
                                    caso.solicitante
                                  }}</strong></b-row
                                >
                                <b-row>{{
                                  formatFecha(caso.caso_fecha_apertura)
                                }}</b-row>
                              </b-card-text>
                            </b-col>
                            <b-col cols="9" style="margin-right: 75px"
                              ><b-card
                                style="background-color: #58d68d"
                                class="card-border"
                                :title="caso.caso_titulo"
                              >
                                <b-card-text class="text-white">{{
                                  caso.caso_descripcion
                                }}</b-card-text>
                                <b-card-text
                                  class="text-right text-white font-italic"
                                  >Apertura</b-card-text
                                >
                              </b-card></b-col
                            >
                          </b-row>
                        </div>
                      </div>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="historial">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="text-dark">Historial</h4>
                      <encabezado-caso
                        :casoId="formatearRadicado()"
                        :solicitante="caso.solicitante"
                        :fechaHora="fechaLegibleUsuario(caso.caso_fecha_solicitud)"
                      ></encabezado-caso>
                    </template>
                    <template v-slot:body>
                      <section class="timeline">
                        <b-card-text>
                          <ul>
                            <li v-if="caso.caso_fecha_cierre != null">
                              <span></span>
                              <div>Fecha de Cierre</div>
                              <div class="year">
                                <span>{{
                                  formatFecha(caso.caso_fecha_cierre)
                                }}</span>
                              </div>
                            </li>
                            <li v-if="caso.fecha_solucion != 'Por Asignar'">
                              <span></span>
                              <div>Fecha de Solución</div>
                              <div class="year">
                                <span>{{
                                  formatFecha(caso.fecha_solucion)
                                }}</span>
                              </div>
                            </li>
                            <li v-if="caso.caso_fecha_asignacion != null">
                              <span></span>
                              <div>Fecha de Asignacion</div>
                              <div class="year">
                                <span>{{
                                  formatFecha(caso.caso_fecha_asignacion)
                                }}</span>
                              </div>
                            </li>
                            <li>
                              <span></span>
                              <div>Fecha de Apertura</div>
                              <div class="year">
                                <span>{{
                                  formatFecha(caso.caso_fecha_apertura)
                                }}</span>
                              </div>
                            </li>
                          </ul>
                        </b-card-text>
                      </section>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="archivos">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="text-dark">Archivos</h4>
                      <encabezado-caso
                        :casoId="formatearRadicado()"
                        :solicitante="caso.solicitante"
                        :fechaHora="fechaLegibleUsuario(caso.caso_fecha_solicitud)"
                      ></encabezado-caso>
                    </template>
                    <template v-slot:body>
                      <h5 v-if="archivos.length > 0">Documentos Caso:</h5>
                      <div
                        style="margin-top: 10px"
                        v-for="(archivo, index) in archivos"
                        :key="archivo.arch_casos_id + index"
                      >
                        <b-card-text>
                          <b-col>
                            <span
                              :style="
                                archivo.deleted_at != null
                                  ? 'opacity: 0.4;'
                                  : 'text-decoration: underline;cursor: pointer;'
                              "
                              @click="
                                descargarArchivoCaso(
                                  archivo.arch_casos_nombre,
                                  archivo.arch_casos_id
                                )
                              "
                              v-b-tooltip.hover
                              title="Descargar archivo"
                              >{{ archivo.arch_casos_nombre }}
                              {{
                                archivo.deleted_at != null
                                  ? '  eliminado por ' + archivo.user
                                  : ' '
                              }} </span
                            >&nbsp;
                            <strong> Fecha de Recepcion: </strong>
                            {{ archivo.arch_casos_fecha_recepcion }}
                          </b-col>
                        </b-card-text>
                      </div>
                      <h5
                        v-if="archivosSeguimiento.length > 0"
                        style="margin-top: 20px"
                      >
                        Documentos Seguimiento:
                      </h5>
                      <div
                        style="margin-top: 10px"
                        v-for="(archivo, index) in archivosSeguimiento"
                        :key="archivo.arch_seg_id + index"
                      >
                        <b-card-text>
                          <b-col>
                            <span
                              :style="
                                archivo.deleted_at != null
                                  ? 'opacity: 0.4;'
                                  : 'text-decoration: underline;cursor: pointer;'
                              "
                              @click="
                                descargarArchivoSeguimiento(
                                  archivo.arch_seg_nombre,
                                  archivo.arch_seg_id
                                )
                              "
                              v-b-tooltip.hover
                              title="Descargar archivo"
                              >{{ archivo.arch_seg_nombre }}
                              {{
                                archivo.deleted_at != null
                                  ? '  eliminado por ' + archivo.user
                                  : ' '
                              }} </span
                            >&nbsp;
                            <strong> Fecha de Recepcion: </strong>
                            {{ archivo.arch_seg_fecha_recepcion }}
                          </b-col>
                        </b-card-text>
                      </div>
                    </template>
                  </iq-card>
                </tab-content-item>
              </tab-content>
            </div>
          </b-col>
        </b-row>
      </div>
    </section>
  </b-container>
</template>
<script>
import auth from '@/logic/auth'
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
import fileDownload from 'js-file-download'
import FormCase from '../Cases/components/FormCase.vue'
import FormSegumiento from '../Cases/components/FormSegumiento.vue'
import moment from 'moment'
import EncabezadoCaso from './components/EncabezadoCaso.vue'
moment.locale('es')
export default {
  name: 'ShowCase',
  components: {
    FormCase,
    FormSegumiento,
    EncabezadoCaso
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Editar Caso',
      caso: {},
      archivos: [],
      archivosSeguimiento: [],
      cantidadArchivos: 0,
      asignarProfiles: [1, 12],
      perfilesPermitidosVerHorasInvertidas: [1, 2],
      user_profile: null,
      progress_total: 4,
      max: 100,
      loading: true,
      addSeguimiento: false,
      seguimientosCaso: [],
      profesionalesOptions: [],
      asginarData: {
        profesional_id: ''
      }
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
    this.getCase()
    this.getSeguimientos()
    this.user_profile = this.userLogged.user_profile
  },
  methods: {
    getCase () {
      this.$bvModal.hide('modal-editar-caso')
      this.user_profile = this.userLogged.user_profile
      axios
        .get('/show-caso/' + this.$route.params.caso_id)
        .then((res) => {
          this.caso = res.data.caso
          this.archivos = res.data.archivos
          this.cantidadArchivos = res.data.archivos.length
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
    descargarArchivoCaso (filename, id) {
      axios({
        url: '/casos/descargar-archivo/' + id,
        method: 'GET',
        responseType: 'blob'
      })
        .then((response) => {
          if (response.data != null) {
            fileDownload(response.data, filename)
          } else {
            Vue.swal('No se encontró archivo')
          }
        })
        .catch((err) => {
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    editarCaso () {
      this.$bvModal.show('modal-editar-caso')
    },
    getSeguimientos () {
      this.addSeguimiento = false
      axios
        .get('/seguimientos-caso/' + this.$route.params.caso_id)
        .then((res) => {
          if (res.status === 200) {
            this.seguimientosCaso = res.data.seguimientos
            this.archivosSeguimiento = res.data.archivoSeguimiento
            this.cantidadArchivos += res.data.archivoSeguimiento.length
          }
        })
    },
    onCancel () {
      this.addSeguimiento = false
    },
    descargarArchivoSeguimiento (filename, id) {
      axios({
        url: '/seguimiento/descargar-archivo/' + id,
        method: 'GET',
        responseType: 'blob'
      })
        .then((response) => {
          if (response.data != null) {
            fileDownload(response.data, filename)
          } else {
            Vue.swal('No se encontró archivo')
          }
        })
        .catch((err) => {
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    formatFecha (fecha) {
      return moment(fecha).format('DD/MM/YYYY')
    },
    asignarCaso (caso) {
      this.getProfesionals()
      this.caso = caso
      this.$bvModal.show('modal-asignar-caso')
    },
    getProfesionals () {
      axios.get('/professionals/fetch').then((response) => {
        this.profesionalesOptions = response.data.professionals
      })
    },
    SaveAsignacionCaso () {
      if (this.asginarData.profesional_id !== '') {
        this.$bvModal.hide('modal-asignar-caso')
        axios
          .post('/casos/asignar/' + this.caso.caso_id, this.asginarData)
          .then((res) => {
            if (res.status === 200) {
              this.getCase()
            }
            Vue.swal(res.data.message)
          })
      } else {
        Vue.swal('Por favor selecione un Abogado')
      }
    },
    formatId (casoId) {
      const digitos = casoId.length

      let identificador

      switch (digitos) {
        case 1:
          identificador = '000' + casoId
          break
        case 2:
          identificador = '00' + casoId
          break
        case 3:
          identificador = '0' + casoId
          break
        default:
          identificador = casoId
          break
      }

      return identificador
    },
    irAProceso () {
      this.$router.push({ path: `/process/process-show/${this.caso.prore_id}/false` })
    },
    convertirHorasInvertidas () {
      const horasEnteras = Math.floor(this.caso.caso_horas_invertidas) // Obtener la parte entera de las horas
      const minutosDecimal = this.caso.caso_horas_invertidas - horasEnteras // Obtener la parte decimal de las horas
      const minutos = Math.round(minutosDecimal * 60) // Convertir la parte decimal a minutos
      return horasEnteras + ' horas y ' + minutos + ' minutos.'
    },
    fechaLegibleUsuario (fecha) {
      return moment(fecha).format('dddd D [de] MMMM hh:mm A')
    },
    formatearRadicado () {
      return new Date(this.caso.caso_fecha_apertura).getFullYear() +
      '-' +
      this.formatId(String(this.caso.caso_id))
    }
  }
}
</script>
