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
              :onEdit="true"
              :reloadFunciont="this.getCase"
            />
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
                      <h4>
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
                                  <b-row>{{ seguimiento.seg_fecha }}</b-row>
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
                                  <b-row>{{ seguimiento.seg_fecha }}</b-row>
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
                                <b-row>{{ caso.caso_fecha_apertura }}</b-row>
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
                              <span>{{ caso.caso_fecha_cierre }}</span>
                            </div>
                          </li>
                          <li v-if="caso.fecha_solucion != null">
                            <span></span>
                            <div>Fecha de Solución</div>
                            <div class="year">
                              <span>{{ caso.fecha_solucion }}</span>
                            </div>
                          </li>
                          <li v-if="caso.caso_fecha_asignacion != null">
                            <span></span>
                            <div>Fecha de Asignacion</div>
                            <div class="year">
                              <span>{{ caso.caso_fecha_asignacion }}</span>
                            </div>
                          </li>
                          <li>
                            <span></span>
                            <div>Fecha de Apertura</div>
                            <div class="year">
                              <span>{{ caso.caso_fecha_apertura }}</span>
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
                        :key="index"
                      >
                        <b-card-text>
                          <b-col>
                            <span
                              style="
                                text-decoration: underline;
                                cursor: pointer;
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
                            </span>
                            <b-badge
                              variant="danger"
                              style="margin-left: 5px"
                              v-b-tooltip.hover
                              title="Quitar archivo"
                              @click="
                                eliminarArchivo('caso', archivo.arch_casos_id)
                              "
                              ><em class="fa fa-times"></em
                            ></b-badge>
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
                        :key="index"
                      >
                        <b-card-text>
                          <b-col>
                            <span
                              style="
                                text-decoration: underline;
                                cursor: pointer;
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
                            </span>
                            <b-badge
                              variant="danger"
                              style="margin-left: 5px"
                              v-b-tooltip.hover
                              title="Quitar archivo"
                              @click="
                                eliminarArchivo(
                                  'segumiento',
                                  archivo.arch_seg_id
                                )
                              "
                              ><em class="fa fa-times"></em
                            ></b-badge>
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
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
import fileDownload from 'js-file-download'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import FormCase from '../Cases/components/FormCase.vue'
import FormSegumiento from '../Cases/components/FormSegumiento.vue'
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
      progress_total: 4,
      max: 100,
      loading: true,
      addSeguimiento: false,
      seguimientosCaso: []
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
    eliminarArchivo (tipo, archivoId) {
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este Archivo?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get('/archivo-' + tipo + '/delete/' + archivoId)
            .then((res) => {
              if (res.status === 200) {
                this.loading = true
                this.getCase()
              }
              Vue.swal(res.data.message)
            })
            .catch((err) => {
              Vue.swal(
                'Ups sucedió un error tratando de consulta la información. ' +
                  err
              )
            })
        }
      })
    }
  }
}
</script>
