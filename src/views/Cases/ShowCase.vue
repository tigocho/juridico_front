<template>
  <b-container fluid>
    <section>
       <div class="py-5" v-if="loading">
        <b-progress :max="max" height="2rem">
          <b-progress-bar :progress_total="progress_total" variant="success" :style="{width: progress_total + '%'}">
            <span><b>{{ progress_total }}%</b></span>
          </b-progress-bar>
        </b-progress>
      </div>
      <div v-else>
        <!-- MODAL DE EDITAR CASO -->
        <div>
          <b-modal id="modal-editar-caso" size="lg" title="Editar Caso" hide-footer>
             <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form ref="form" @submit.prevent="handleSubmit(onSubmit)">
               <b-row class="justify-content-center text-center align-items-center">
                        <b-col lg="6">
                        <b-form-group  label="Titulo de la Solicitud*" label-for="case_title">
                            <b-form-input v-model="caso.caso_titulo" type="text" :required="true" ></b-form-input>
                        </b-form-group>
                        <b-form-group  label="Descripción*" label-for="textarea-decription">
                            <b-form-textarea id="textarea-decription" v-model="caso.caso_descripcion" :required="true" ></b-form-textarea>
                        </b-form-group>
                        <b-form-group >
                            <b-button variant="primary" type="submit"  :class="estadoBoton">{{ textoBoton }}</b-button>
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
                    <tab-nav-items class="col-auto p-0" :active="true" href="#información-general" title="Información General" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#seguimiento" title="Segumiento" />
                    <tab-nav-items class="col-auto p-0" disabled :active="false" href="#historial" title="Historial" />
                  </tab-nav>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="12" class="pagina-detalle-proceso">
            <div class="iq-edit-list-data">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="información-general" >
                  <iq-card>
                     <template v-slot:headerTitle>
                      <h4 class="card-title">ID - {{ caso.caso_id }}</h4>
                    </template>
                    <template v-slot:headerAction>
                       <b-badge variant="secondary"> {{ caso.estado }}</b-badge>
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
                            {{ caso.caso_fecha_estimada_solucion }}
                          </b-col>
                        </b-row>
                      </b-card-text>
                      <b-card-text>
                        <b-row>
                          <b-col
                            ><strong>Solicitante: </strong>
                            {{ caso.solicitante }}</b-col
                          >
                          <b-col cols="5"
                            ><strong>Abogado: </strong> {{ caso.abogado }}
                          </b-col>
                        </b-row>
                      </b-card-text>
                      <b-card-text>
                        <strong>Clínica: </strong> {{ caso.cli_name }}
                      </b-card-text>
                      <b-card-text>
                        <strong>Medio de Solicitud: </strong>
                        {{ caso.med_sol_nombre }}
                      </b-card-text>
                      <b-card-text>
                        <strong>Archivo: </strong>
                        <span
                          v-if="archivo != null"
                          style="text-decoration: underline; cursor: pointer"
                          @click="descargarArchivoCaso()"
                          >Descargar Archivo
                        </span>
                      </b-card-text>
                      <b-card-text>
                        <strong>Descripción </strong>
                        <p>{{ caso.caso_descripcion }}</p>
                      </b-card-text>
                    </template>
                    <template v-slot:footer>
                      <div class="text-right">
                        <b-button variant="primary"   @click="editarCaso">Editar Caso</b-button>
                      </div>
                    </template>
                  </iq-card>
                </tab-content-item>
                 <tab-content-item :active="false" id="seguimiento" >
                  </tab-content-item>
                  <tab-content-item :active="false" id="historial" >
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
export default {
  name: 'ShowCase',
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Editar Caso',
      caso: {},
      archivo: {},
      progress_total: 4,
      loading: true
    }
  },
  mounted () {
    this.barraCargando()
    this.getCase()
  },
  methods: {
    getCase () {
      axios
        .get('/show-caso/' + this.$route.params.caso_id)
        .then((res) => {
          this.caso = res.data.caso[0]
          this.archivo = res.data.archivos[0]
        })
        .catch((err) => {
          this.errores = err
        })
        .finally(setTimeout(() => {
          this.loading = false
        }, 3500))
    },
    descargarArchivoCaso () {
      axios({
        url: '/casos/descargar-archivo/' + this.$route.params.caso_id,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        if (response.data != null) {
          const filename = this.caso.caso_titulo + '-' + this.caso.caso_id + '.pdf'
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
    onSubmit () {
      this.actualizarCaso()
    },
    actualizarCaso () {
      axios.post('/casos/update/' + this.caso.caso_id, this.caso).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal(res.data.message)
          this.getCase()
        } else {
          Vue.swal(res.data.message)
        }
      })
    }
  }
}
</script>
