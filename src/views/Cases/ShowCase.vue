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
                      title="Archivos"
                    />
                  </tab-nav>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="12" class="pagina-detalle-proceso">
            <div class="iq-edit-list-data">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="información-general">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">ID - {{ caso.caso_id }}</h4>
                    </template>
                    <template v-slot:headerAction>
                      <b-button
                        v-if="
                          caso.est_id === 1 &&
                          asignarProfiles.includes(user_profile)
                        "
                        variant="secondary"
                        style="margin-left: 5px"
                        @click="asignarCaso(caso)"
                        >Asignar Caso</b-button
                      >
                      <h4 v-else>
                        <b-badge variant="secondary">
                          {{ caso.estado }}</b-badge
                        >
                      </h4>
                      <b-button
                        variant="primary"
                        style="margin-left: 5px"
                        @click="editarCaso"
                        >Editar Caso</b-button
                      >
                    </template>
                    <template v-slot:body>
                      <b-card-text>
                        <b-row>
                          <b-col
                            ><strong>Título: </strong>
                            {{ caso.caso_titulo }}</b-col
                          >
                          <b-col cols="5"
                            ><strong>Tiempo de Solución: </strong>
                            {{ caso.fecha_solucion }}
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col
                            ><strong>Solicitante: </strong>
                            {{ caso.solicitante }}</b-col
                          >
                          <b-col cols="5"
                            ><strong>Abogado: </strong> {{ caso.abogado }}
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col>
                            <strong>Clínica: </strong> {{ caso.cli_name }}
                          </b-col>
                          <b-col cols="5"
                            ><strong>Tipo de Actividad: </strong>
                            {{ caso.subactividad }}
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col>
                            <strong>Medio de Solicitud: </strong>
                            {{ caso.med_sol_nombre }}
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
                      <h4 class="card-title">Seguimiento</h4>
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
                                  style="
                                    border-radius: 20px;
                                    border: 1px solid #000;
                                  "
                                  :bg-variant="
                                    seguimiento.seg_tipo_seg_id === 2
                                      ? 'success'
                                      : seguimiento.seg_tipo_seg_id === 3
                                      ? 'danger'
                                      : 'info'
                                  "
                                  :title="seguimiento.seg_titulo"
                                >
                                  <b-card-text>{{
                                    seguimiento.seg_descripcion
                                  }}</b-card-text>
                                </b-card></b-col
                              >
                            </b-row>
                          </div>
                          <div v-else>
                            <b-row>
                              <b-col cols="8" style="margin-left: 25px"
                                ><b-card
                                  style="
                                    border-radius: 20px;
                                    border: 1px solid #000;
                                  "
                                  :bg-variant="
                                    seguimiento.seg_tipo_seg_id === 2
                                      ? 'light'
                                      : seguimiento.seg_tipo_seg_id === 3
                                      ? 'danger'
                                      : 'info'
                                  "
                                  :title="seguimiento.seg_titulo"
                                >
                                  <b-card-text>{{
                                    seguimiento.seg_descripcion
                                  }}</b-card-text>
                                  <b-card-text class="text-right font-italic">{{
                                    seguimiento.tipo_seg_nombre
                                  }}</b-card-text>
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
                                style="
                                  border-radius: 20px;
                                  border: 1px solid #000;
                                "
                                bg-variant="success"
                                :title="caso.caso_titulo"
                              >
                                <b-card-text>{{
                                  caso.caso_descripcion
                                }}</b-card-text>
                                <b-card-text class="text-right font-italic"
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
                      <h4 class="card-title">
                        Archivos Caso - {{ caso.caso_id }}
                      </h4>
                    </template>
                    <template v-slot:body>
                      <h5 v-if="archivos.length > 0">Documentos Caso:</h5>
                      <div
                        style="margin-top: 10px"
                        v-for="(archivo, index) in archivos"
                        :key="archivo.arch_casos_id+index"
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
                              }}
                            </span>&nbsp;
                            <strong>
                              Fecha de Recepcion:
                            </strong>
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
                        :key="archivo.arch_seg_id+index"
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
                              }}
                            </span>&nbsp;
                            <strong>
                              Fecha de Recepcion:
                            </strong>
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
export default {
  name: 'ShowCase',
  components: {
    FormCase,
    FormSegumiento
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Editar Caso',
      caso: {},
      archivos: [],
      archivosSeguimiento: [],
      asignarProfiles: [1, 12],
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
      return JSON.parse(auth.getUserLogged())
    }
  },
  mounted () {
    xray.index()
    this.barraCargando()
    this.getCase()
    this.getSeguimientos()
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
              this.getCasosToAssing()
            }
            Vue.swal(res.data.message)
          })
      } else {
        Vue.swal('Por favor selecione un Abogado')
      }
    }
  }
}
</script>
