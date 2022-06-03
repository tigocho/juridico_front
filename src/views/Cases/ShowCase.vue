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
                      title="Segumiento"
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
                            {{ caso.subact_nombre }}
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
                </tab-content-item>
                <tab-content-item :active="false" id="historial">
                </tab-content-item>
                <tab-content-item :active="false" id="archivos">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">
                        Archivos Caso - {{ caso.caso_id }}
                      </h4>
                    </template>
                    <template v-slot:body>
                      <div v-for="(archivo, index) in archivos" :key="index">
                        <b-card-text>
                          <b-col>
                            <span
                              style="
                                text-decoration: underline;
                                cursor: pointer;
                              "
                              @click="
                                descargarArchivoCaso(archivo.arch_casos_nombre)
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
                              @click="eliminarArchivo(archivo.arch_casos_id)"
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
import axios from 'axios'
import Vue from 'vue'
import fileDownload from 'js-file-download'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import FormCase from '../Cases/components/FormCase.vue'
export default {
  name: 'ShowCase',
  components: {
    FormCase
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Editar Caso',
      caso: {},
      archivos: [],
      progress_total: 4,
      max: 100,
      loading: true
    }
  },
  mounted () {
    this.barraCargando()
    this.getCase()
  },
  methods: {
    getCase () {
      this.$bvModal.hide('modal-editar-caso')
      axios
        .get('/show-caso/' + this.$route.params.caso_id)
        .then((res) => {
          this.caso = res.data.caso[0]
          this.archivos = res.data.archivos
        })
        .catch((err) => {
          this.errores = err
        })
        .finally(
          setTimeout(() => {
            this.loading = false
          }, 3500)
        )
    },
    descargarArchivoCaso (filename) {
      axios({
        url: '/casos/descargar-archivo/' + this.$route.params.caso_id,
        method: 'GET',
        responseType: 'blob'
      })
        .then((response) => {
          console.log(response)
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
    eliminarArchivo (archivoId) {
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este Archivo?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .get('/archivo-caso/delete/' + archivoId)
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
