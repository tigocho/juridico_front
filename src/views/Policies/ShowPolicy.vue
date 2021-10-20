<template>
  <b-container fluid>
    <section>
      <div class="py-5" v-if="pol_id !== undefined && loading">
        <b-progress :max="max" height="2rem">
          <b-progress-bar :progress_total="progress_total" variant="success" :style="{width: progress_total + '%'}">
            <span><b>{{ progress_total }}%</b></span>
          </b-progress-bar>
        </b-progress>
      </div>
      <div v-else>
        <!-- INICIAL DE MODAL DE AFECTACIÓN -->
        <div>
          <b-modal id="modal-nueva-afectacion" size="lg" title="Agregar Afectación" hide-footer>
            <form ref="form" @submit.stop.prevent="handleSubmit">
              <p v-if="errors.length">
                <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>
              <b-form-group label="Proceso que afectó la poliza*" label-for="pol_affe_prore_id">
                <v-select v-model="afectacionPoliza.pol_affe_prore_id" :options="processOptions" :reduce="label => label.code" label="label" id="pol_ase_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                  <span slot="no-options">No hay procesos.</span>
                </v-select>
              </b-form-group>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Valor bruto de la afectación (Sin deducible)" label-for="pol_affe_valor_bruto">
                    <b-form-input id="pol_affe_valor_bruto" @change="valorNetoAfectacion" v-model="afectacionPoliza.pol_affe_valor_bruto" type="number"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Deducible" label-for="pol_affe_valor_deducible">
                    <b-form-input id="pol_affe_valor_bruto" @change="valorNetoAfectacion" v-model="afectacionPoliza.pol_affe_valor_deducible" type="number"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Valor neto de la afectación" label-for="pol_affe_valor_neto">
                  <b-form-input id="pol_affe_valor_neto" v-model="afectacionPoliza.pol_affe_valor_neto" type="number"></b-form-input>
                </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Fecha de afectación" label-for="pol_affe_fecha">
                  <b-form-input id="pol_affe_fecha" v-model="afectacionPoliza.pol_affe_fecha" type="date"></b-form-input>
                </b-form-group>
                </b-col>
              </b-row>
              <div class="text-right pt-1">
                <b-button class="sm-3 mr-1" variant="secondary" @click="cancelado">Cancelar</b-button>
                <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarAfectacion">{{ textoGuardarAfectacion }}</b-button>
              </div>
            </form>
          </b-modal>
        </div>
        <!-- FIN DE MODAL DE AFECTACIÓN -->
        <b-row>
          <b-col lg="12">
            <iq-card body-class="p-0">
              <template v-slot:body>
                <div class="iq-edit-list">
                  <tab-nav :pills="true" class="iq-edit-profile d-flex">
                    <tab-nav-items class="col-auto p-0" :active="true" href="#información-general" title="Información Poliza" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#afectaciones" title="Afectaciones" />
                    <tab-nav-items class="col-auto p-0" disabled :active="false" href="#poliza-procesos" title="Procesos" />
                  </tab-nav>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="12" class="pagina-detalle-poliza">
            <div class="iq-edit-list-data">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="información-general" >
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Información de la poliza</h4>
                    </template>
                    <template v-slot:headerAction>
                      <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionPoliza">Cancelar</b-button>
                      <b-button variant="primary" v-if="poliza.pol_estado == 1" :class="estadoBotonActualizarPoliza" @click="editarPoliza">{{ textoEditarPoliza }}</b-button>
                    </template>
                    <template v-slot:body>
                      <div v-if="!editando">
                        <b-row class="col-md-12 pt-1">
                           <b-card-text class="pr-3 my-0"><b>Aseguradora:</b> <span v-if="poliza.pol_ase_id != null">{{ poliza.aseguradora.ase_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Número de póliza: </b><span v-if="poliza.pol_numero != null">{{ poliza.pol_numero }} </span><span class="text-danger" v-if="poliza.pol_numero == null">Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Tomador: </b><span v-if="poliza.pol_cli_id != null">{{ poliza.clinica.cli_name }} </span><span class="text-danger" v-if="poliza.pol_cli_id == null">Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>PDF de poliza: </b>
                            <span v-if="poliza.pol_url_pdf != null" style="text-decoration:underline;cursor:pointer" @click="descargarArchivoPoliza(poliza.pol_id)">Descargar Archivo
                            </span>
                            <span class="text-danger" v-else>Sin Archivo</span>
                          </b-card-text>
                        </b-row>
                        <hr>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Fecha inicio vigencia: </b><span v-if="poliza.pol_fecha_inicio != null">{{ poliza.pol_fecha_inicio }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha fin vigencia: </b><span v-if="poliza.pol_fecha_fin != null">{{ poliza.pol_fecha_fin }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <hr>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Total asegurado: </b><span v-if="poliza.pol_total_asegurado != null">{{ formatPrice(poliza.pol_total_asegurado) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Cobertura actual: </b><span v-if="poliza.pol_cobertura_actual != null">{{ formatPrice(poliza.pol_cobertura_actual) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="my-0 pr-3"><b>Deducible: </b><span v-if="poliza.pol_deducible != null">{{ poliza.pol_deducible }}%</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="my-0 pr-3"><b>Deducible Mínimo: </b><span v-if="poliza.pol_deducible_minimo != null">{{ formatPrice(poliza.pol_deducible_minimo) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Provisiones Constituidas:</b> <span v-if="poliza.pol_provisiones != null">{{ formatPrice(poliza.pol_provisiones) }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Estado:</b> <span v-if="poliza.pol_estado">Poliza Activa</span><span class="text-danger" v-else>Poliza Inactiva</span></b-card-text>
                        </b-row>
                      </div>
                      <div v-else>
                        <b-col md="12">
                          <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                          <form novalidate @submit.prevent="handleSubmit(onSubmit)">
                          <b-row>
                            <b-col lg="12">
                              <iq-card>
                                <template v-slot:headerTitle>
                                  <h4 class="card-title">Edición de Póliza</h4>
                                </template>
                                <template v-slot:body>
                                  <div class="new-poliza-info">
                                    <b-row>
                                      <b-form-group class="col-md-6" label="Aseguradora*" label-for="pol_ase_id">
                                        <ValidationProvider name="Aseguradora" rules="required" v-slot="{ errors }">
                                          <v-select v-model="poliza.pol_ase_id" :options="aseguradoraOptions" :reduce="label => label.code" label="label" id="pol_ase_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                            <span slot="no-options">No hay aseguradoras.</span>
                                          </v-select>
                                          <div class="invalid-feedback">
                                            <span>Debe de seleccionar una opción</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Clinica a quien pertenece la póliza*" label-for="usr_role_id">
                                        <ValidationProvider name="Clínica" rules="required" v-slot="{ errors }">
                                          <v-select v-model="poliza.pol_cli_id" :options="clinicaOptions" :reduce="label => label.code" id="pol_ase_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                            <span slot="no-options">No hay Pabellones.</span>
                                          </v-select>
                                          <div class="invalid-feedback">
                                            <span>Debe de seleccionar una opción</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Número de poliza*" label-for="pol_total_asegurado">
                                        <ValidationProvider name="Número de poliza" rules="required" v-slot="{ errors }">
                                          <b-form-input v-model="poliza.pol_numero" type="text" placeholder="9387183671" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                          <div class="invalid-feedback">
                                            <span>Por favor verifique la información</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Fecha inicio de vigencia de poliza*" label-for="pol_fecha_inicio">
                                        <ValidationProvider name="Fecha inicio de vigencia de poliza" rules="required" v-slot="{ errors }">
                                          <b-form-input v-model="poliza.pol_fecha_inicio" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                          <div class="invalid-feedback">
                                            <span>Por favor verifique la información</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Fecha fin de vigencia de poliza*" label-for="pol_fecha_fin">
                                        <ValidationProvider name="Fecha inicio de vigencia de poliza" rules="required" v-slot="{ errors }">
                                          <b-form-input v-model="poliza.pol_fecha_fin" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                          <div class="invalid-feedback">
                                            <span>Por favor verifique la información</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Total asegurado*" label-for="pol_total_asegurado">
                                        <ValidationProvider name="Total Asegurado" rules="required" v-slot="{ errors }">
                                          <b-form-input v-model="poliza.pol_total_asegurado" type="number" placeholder="EJ: 10000000" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                          <div class="invalid-feedback">
                                            <span>Por favor verifique la información</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Cobertura actual*" label-for="pol_cobertura_actual">
                                        <ValidationProvider name="Cobertual Actual" rules="required" v-slot="{ errors }">
                                          <b-form-input v-model="poliza.pol_cobertura_actual" type="number" placeholder="EJ: 5000000" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                          <div class="invalid-feedback">
                                            <span>Por favor verifique la información</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Deducible(%)" label-for="pol_deducible">
                                        <ValidationProvider name="Deducible" rules="max_value: 100" v-slot="{ errors }">
                                          <div class="input-group">
                                            <b-form-input v-model="poliza.pol_deducible" type="number" placeholder="EJ: 10" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="input-group-prepend">
                                              <span class="input-group-text" id="inputGroupPrepend">%</span>
                                            </div>
                                            <div class="invalid-feedback">
                                              <span>El deducible no puede ser mayor a 100%</span>
                                            </div>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Deducible Mínimo" label-for="pol_deducible_minimo">
                                        <b-form-input v-model="poliza.pol_deducible_minimo" type="number" placeholder="EJ: 100'000.000" ></b-form-input>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Proivisiones Constituidas*" label-for="pol_provisiones">
                                        <ValidationProvider name="Proivisiones Constituidas" rules="required" v-slot="{ errors }">
                                          <b-form-input v-model="poliza.pol_provisiones" type="number" placeholder="EJ: 5000000" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                          <div class="invalid-feedback">
                                            <span>Por favor verifique la información</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" ref="addProcess" label-for="exampleFormControlFile1" label="Subir documento de póliza">
                                        <b-form-file id="input-file-import" name="file_import" ref="import_file" @change="onFileChange"></b-form-file>
                                      </b-form-group>
                                      <b-form-group class="col-md-6" label="Estado de la poliza" label-for="pol_estado">
                                        <ValidationProvider name="Estado de la poliza" rules="required" v-slot="{ errors }">
                                          <template v-for="(item,index) in estadoPoliza">
                                            <b-form-radio inline v-model="poliza.pol_estado" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled" :class="(errors.length > 0 ? ' is-invalid' : '')">{{ item.label }}</b-form-radio>
                                          </template>
                                          <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                          </div>
                                        </ValidationProvider>
                                      </b-form-group>
                                    </b-row>
                                  <b-button variant="primary" type="submit" :class="estadoBoton">{{ textoBoton }}</b-button>
                                </div>
                                </template>
                              </iq-card>
                            </b-col>
                          </b-row>
                          </form>
                          </ValidationObserver>
                        </b-col>
                      </div>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="afectaciones">
                  <iq-card :key="afectacionesKey">
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Afectaciones</h4>
                    </template>
                    <template v-slot:headerAction>
                      <button class="btn btn-primary" v-if="poliza.pol_estado == 1" @click="agregarAfectacion"><i class="ri-add-line mr-2" ></i>Agregar afectación</button>
                    </template>
                    <template v-slot:body>
                      <ul class="iq-timeline">
                        <li class="col-md-12" v-for="(afectacionFor, index) in afectacionesPoliza" :key="index">
                          <div class="timeline-dots border-primary" v-if="index == 0" :class="'border-primary'"></div>
                          <div class="timeline-dots border-primary" v-else :class="'border-warning'"></div>
                          <h6 class="float-left mb-1 font-weight-bolder">{{ afectacionFor.process_request.prore_num_radicado }} <button v-if="index == 0 && poliza.pol_estado == 1" class="btn btn-link pt-0" @click="editAfectacion(index)"><i class="ri-edit-2-fill"></i>Editar</button> <button v-if="index == 0 && poliza.pol_estado == 1" @click="deleteAfectacion(afectacionFor.pol_affe_id)" class="btn btn-link pt-0 px-0 text-danger"><i class="ri-delete-bin-6-fill"></i>Eliminar</button></h6>
                          <b-row class="col-md-12 pt-1">
                            <b-card-text class="my-0"><b>Fecha de afectación: </b><span v-if="afectacionFor.pol_affe_fecha != null">{{ afectacionFor.pol_affe_fecha }}</span></b-card-text>
                            <b-card-text class="pl-3 my-0"><b>Valor bruto afectado: </b><span>{{ formatPrice(afectacionFor.pol_affe_valor_bruto) }}</span></b-card-text>
                            <b-card-text class="pl-3 my-0"><b>Deducido: </b>{{ formatPrice(afectacionFor.pol_affe_valor_deducible) }}</b-card-text>
                            <b-card-text class="pl-3 my-0"><b>Valor neto afectado: </b>{{ formatPrice(afectacionFor.pol_affe_valor_neto) }}</b-card-text>
                            <b-card-text class="my-0"><b>Cobertura anterior de la poliza: </b>{{ formatPrice(afectacionFor.pol_affe_poliza_cobertura_anterior) }}</b-card-text>
                            <b-card-text class="pl-3 my-0"><b>Cobertura de la poliza luego de afectación: </b>{{ formatPrice(afectacionFor.pol_affe_poliza_nueva_cobertura) }}</b-card-text>
                          </b-row>
                        </li>
                      </ul>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="poliza-procesos">
                  <iq-card :key="polizaProcesosKey">
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Procesos en los que se encuentra la póliza</h4>
                    </template>
                    <template v-slot:headerAction>
                      <button class="btn btn-primary disabled" v-if="poliza.pol_estado == 1" @click="agregarProceso"><i class="ri-add-line mr-2" ></i>Agregar Proceso</button>
                    </template>
                    <template v-slot:body>
                      <div v-if="process != null && process.length > 0">
                        <div v-for="(proceso, index) in process" :key="index" class="pt-2">
                          <!-- <b-card-text v-b-toggle="'collapse-' +  index" variant="primary" style="text-decoration:underline;cursor:pointer">Proceso {{ proceso.prore_num_radicado }}</b-card-text> -->
                          <button class="btn btn-primary" v-b-toggle="'collapse-' +  index"><i class="ri-arrow-right-s-line"></i>Ver proceso {{ proceso.prore_num_radicado }} </button>
                          <b-collapse :id="'collapse-' + index" >
                            <b-row class="col-md-12 pt-1">
                              <!-- <b-card-text class="my-0 pr-3"><b>Etapa procesal: </b><span v-if="proceso.proceedings != null && proceso.proceedings[0] != null">{{ proceso.proceedings[0].status_process.estado_proceso }}</span> <span v-else> Sin Asignar </span></b-card-text>
                              <b-card-text class="my-0 pr-3" v-if="proceso.proceedings != null && proceso.proceedings[0] != null && proceso.proceedings[0].status_process.sta_id ===  16"><b>Fecha terminación: </b><span >{{ proceso.proceedings[0].proce_fecha_ingreso }}</span></b-card-text> -->
                              <a @click="irProceso(proceso.prore_id)" class="text-primary pr-3" style="text-decoration:underline;cursor:pointer">Ir al proceso</a>
                              <b-card-text class="pr-3 my-0"><b>ID Litigando: </b><span v-if="proceso.prore_litigando_id != null">{{ proceso.prore_litigando_id }} </span><span class="text-danger" v-if="proceso.prore_litigando_id == null">Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3"><b>Número de Radicado:</b> <span v-if="proceso.prore_num_radicado != null">{{ proceso.prore_num_radicado }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                            </b-row>
                            <hr>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="pr-3 my-0"><b>Tipo de proceso: </b><span v-if="proceso.tipo_proceso != null">{{ proceso.tipo_proceso.typro_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Juzgado: </b><span v-if="proceso.juzgado != null">{{ proceso.juzgado.court_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                            </b-row>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="pr-3 my-0"><b>Proceso Ejecutivo:</b> <span v-if="proceso.prore_proceso_ejecutivo != null">{{ proceso.prore_proceso_ejecutivo }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Ejecutante:</b> <span v-if="proceso.prore_ejecutante != null">{{ proceso.prore_ejecutante }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text><b>Medida Cautelar:</b> <span v-if="proceso.prore_medida_cautelar != null">{{ proceso.prore_medida_cautelar }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                            </b-row>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="pr-3 my-0"><b>Ciudad:</b> <span v-if="proceso.ciudad != null">{{ proceso.ciudad.city_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Fecha ingreso: </b>{{ proceso.prore_fec_ingreso }}</b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Clinica:</b> <span v-if="proceso.clinica != null">{{ proceso.clinica.cli_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Fecha siniestro: </b>{{ proceso.prore_fec_sinister }}</b-card-text>
                            </b-row>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="pr-3 my-0"><b>Fecha aviso:</b> {{ proceso.prore_fec_sinies_aviso }}</b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Fecha de notificación IPS:</b> {{ proceso.prore_fec_recibo_notify }}</b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Colaborador de IPS:</b> {{ proceso.prore_colaborador_ips }}</b-card-text>
                            </b-row>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text class="pr-3 my-0"><b>Año de notificación: </b>{{ proceso.prore_year_notify }}</b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Fecha notificación prejudicial: </b>{{ proceso.prore_fec_noti_preju }}</b-card-text>
                              <b-card-text class="pr-3 my-0"><b>Fecha notificación prejudicial:</b> {{ proceso.prore_fec_audi_conci_preju }}</b-card-text>
                            </b-row>
                            <b-row class="col-md-12 pt-1">
                              <b-card-text><b>Descripción del siniestro: </b>{{ proceso.prore_sinies_description }}</b-card-text>
                            </b-row>
                          </b-collapse>
                        </div>
                      </div>
                      <div v-else>
                        <h6>No existen procesos que puedan afectar a esta poliza</h6>
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
import Vue from 'vue'
import axios from 'axios'
import auth from '@/logic/auth'
import fileDownload from 'js-file-download'
import iqCard from '../../components/xray/cards/iq-card.vue'

export default {
  components: { iqCard },
  name: 'ProfileEdit',
  mounted () {
    xray.index()
    this.getPolicy()
    this.barraCargando()
    setTimeout(() => {
      this.fetchClinicaOptions()
      this.fetchAseguradoraOptions()
      this.fetchProcessOptions()
    }, 500)
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    }
  },
  data () {
    return {
      textoBoton: 'Actualizar Poliza',
      estadoBoton: '',
      textoGuardarAfectacion: 'Guardar',
      estadoBotonActualizarPoliza: '',
      textoEditarPoliza: 'Editar Poliza',
      user_id: null,
      estadoBotonEliminarLinkProceeding: '',
      intentos: 0,
      editando: false,
      aseguradoraOptions: [],
      import_file: '',
      poliza: [],
      loading: true,
      progress_total: 4,
      max: 100,
      botonGuardarModal: '',
      textoGuardarModal: 'Guardar',
      errors: [],
      afectacionesPoliza: [],
      pol_id: this.$route.params.pol_id,
      afectacionPoliza: {
        pol_affe_pol_id: this.$route.params.pol_id,
        pol_affe_prore_id: '',
        pol_affe_valor_bruto: '',
        pol_affe_valor_deducible: '',
        pol_affe_valor_neto: '',
        pol_affe_fecha: '',
        pol_affe_user_id: ''
      },
      year: null,
      process: [],
      clinicaOptions: [],
      processOptions: [],
      errores: {},
      estadoPoliza: [
        {
          name: 'activa',
          label: 'Activa',
          value: 1,
          disabled: false
        },
        {
          name: 'inactiva',
          label: 'Inactiva',
          value: 0,
          disabled: false
        }
      ],
      afectacionesKey: 1,
      polizaProcesosKey: 1
    }
  },
  methods: {
    barraCargando () {
      this.transformarBoolean(this.$route.params.editar)
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    onFileChange (e) {
      this.import_file = e.target.files[0]
    },
    fetchProcessOptions () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/process/obtenerProcesosParaLista/' + this.userLogged.usr_id).then(response => {
          this.processOptions = response.data.process
          if (this.processOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchProcessOptions()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    fetchClinicaOptions () {
      axios.get('/clinicas/obtener-clinicas/' + this.userLogged.usr_id).then(response => {
        this.clinicaOptions = response.data.clinicas
        if (this.clinicaOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchClinicaOptions()
            this.intentos++
          }
        })
    },
    fetchAseguradoraOptions () {
      axios.get('/aseguradoras/fetch-aseguradoras').then(response => {
        this.aseguradoraOptions = response.data.aseguradoras
        if (this.aseguradoraOptions[0] !== undefined) {
          this.intentos = 0
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchAseguradoraOptions()
            this.intentos++
          }
        })
    },
    descargarArchivoPoliza (polizaId) {
      axios({
        url: '/policy/descargar-archivo/' + polizaId,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        let nombrePoliza = this.poliza.aseguradora.ase_name + '-' + this.poliza.pol_numero + '.pdf'
        if (response.data != null) {
          fileDownload(response.data, nombrePoliza)
        } else {
          Vue.swal('No se encontró archivo')
        }
      })
        .catch((err) => {
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    cancelarEdicionPoliza () {
      this.textoEditarPoliza = 'Editar Proceso'
      this.editando = false
    },
    onSubmit () {
      this.estadoBoton = 'disabled'
      this.editarPoliza()
    },
    editarPoliza () {
      // this.$router.push({ path: `/process/process-edit/` + this.prore_id })
      if (this.editando) {
        this.guardarPoliza()
        this.estadoBotonActualizarPoliza = 'disabled'
        this.textoEditarPoliza = 'Actualizando Proceso...'
      } else {
        this.textoEditarPoliza = 'Actualizar Proceso'
        this.editando = true
      }
    },
    guardarPoliza () {
      this.estadoBoton = 'disabled'
      this.textoBoton = 'Actualizando Poliza...'
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.poliza.pol_user_id = this.userLogged.usr_id
      }
      let formData = new FormData()
      formData.append('import_file', this.import_file)
      formData.append('pol_ase_id', this.poliza.pol_ase_id)
      formData.append('pol_cli_id', this.poliza.pol_cli_id)
      formData.append('pol_numero', this.poliza.pol_numero)
      formData.append('pol_fecha_inicio', this.poliza.pol_fecha_inicio)
      formData.append('pol_fecha_fin', this.poliza.pol_fecha_fin)
      formData.append('pol_total_asegurado', this.poliza.pol_total_asegurado)
      formData.append('pol_cobertura_actual', this.poliza.pol_cobertura_actual)
      formData.append('pol_deducible', this.poliza.pol_deducible)
      formData.append('pol_deducible_minimo', this.poliza.pol_deducible_minimo)
      formData.append('pol_provisiones', this.poliza.pol_provisiones)
      formData.append('pol_estado', this.poliza.pol_estado)
      formData.append('pol_user_id', this.poliza.pol_user_id)
      axios.post('/policy/actualizar-poliza/' + this.poliza.pol_id, formData).then(res => {
        this.textoEditarPoliza = 'Editar Poliza'
        this.estadoBotonActualizarPoliza = ''
        if (res.data.status_code === 200) {
          setTimeout(() => {
            this.getPolicy()
            Vue.swal(res.data.message)
            this.editando = false
            this.textoBoton = 'Actualizar Poliza'
            this.estadoBoton = ''
          }, 1000)
        } else {
          this.textoEditarPoliza = 'Guardar Poliza'
          this.textoBoton = 'Actualizar Poliza'
          this.estadoBoton = ''
          Vue.swal('Error tratando de actualizar la poliza. ' + res.data.message)
        }
      })
        .catch((err) => {
          this.textoBoton = 'Actualizar Poliza'
          this.estadoBoton = ''
          Vue.swal('Algo salio mal ' + err)
        })
    },
    getPolicy () {
      if (this.pol_id != null) {
        axios.get('/policy/' + this.pol_id).then(res => {
          setTimeout(() => {
            if (res.data.poliza != null) {
              this.poliza = res.data.poliza[0]
              this.afectacionesPoliza = this.poliza.afectaciones
              this.afectacionesKey++
              if (this.poliza.pol_estado) {
                this.poliza.pol_estado = 1
              } else {
                this.poliza.pol_estado = 0
              }
              if (this.poliza.process_requests != null && this.poliza.process_requests !== '') {
                this.process = this.poliza.process_requests
              }
            } else {
              Vue.swal('Ocurrió un error tratando de obtener los datos de la poliza')
            }
          }, 1000)
        })
          .catch(this.errored = true)
          .finally(setTimeout(() => {
            this.loading = false
          }, 3500))
      }
    },
    guardarAfectacion (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.afectacionPoliza.pol_affe_pol_id = this.pol_id
      if (this.checkFormAfectacion()) {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando...'
        if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
          this.afectacionPoliza.pol_affe_user_id = this.userLogged.usr_id
        }
        if (this.afectacionPoliza.pol_affe_id != null) {
          axios.post('/policyAffectation/actualizar-afectacion/' + this.afectacionPoliza.pol_affe_id, this.afectacionPoliza).then(res => {
            this.textoGuardarModal = 'Guardar'
            this.botonGuardarModal = ''
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              this.$bvModal.hide('modal-nueva-afectacion')
              this.limpiarModalAfectacion()
              this.getPolicy()
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              this.textoGuardarModal = 'Guardar'
              this.botonGuardarModal = ''
              Vue.swal('Ups, ocurrió un error ' + err)
            })
        } else {
          axios.post('/policyAffectation/registrar-afectacion', this.afectacionPoliza).then(res => {
            this.textoGuardarModal = 'Guardar'
            this.botonGuardarModal = ''
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              this.$bvModal.hide('modal-nueva-afectacion')
              this.limpiarModalAfectacion()
              this.getPolicy()
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              this.textoGuardarModal = 'Guardar'
              this.botonGuardarModal = ''
              Vue.swal('Ups, ocurrió un error ' + err)
            })
        }
      } else {
        return false
      }
    },
    getAfectaciones () {
      axios.get('/policyAffectation/obtener-afectaciones/' + this.pol_id).then(response => {
        this.afectacionesKey++
        this.intentos = 0
        this.afectacionesPoliza = response.data.afectaciones
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.getAfectaciones()
          }
          this.intentos++
        })
    },
    checkFormAfectacion () {
      if (this.afectacionPoliza.pol_affe_pol_id && this.afectacionPoliza.pol_affe_prore_id &&
        this.afectacionPoliza.pol_affe_valor_bruto && this.afectacionPoliza.pol_affe_valor_deducible &&
        this.afectacionPoliza.pol_affe_valor_neto && this.afectacionPoliza.pol_affe_fecha) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.afectacionPoliza.pol_affe_prore_id) {
        this.errors.push('El proceso es obligatorio.')
      }
      if (!this.afectacionPoliza.pol_affe_valor_bruto) {
        this.errors.push('El valor bruto es obligatorio.')
      }
      if (!this.afectacionPoliza.pol_affe_valor_deducible) {
        this.errors.push('El valor deducido es obligatoria.')
      }
      if (!this.afectacionPoliza.pol_affe_valor_neto) {
        this.errors.push('El valor neto es obligatorio.')
      }
      if (!this.afectacionPoliza.pol_affe_fecha) {
        this.errors.push('La fecha es obligatoria.')
      }
    },
    agregarAfectacion () {
      this.limpiarModalAfectacion()
      this.$bvModal.show('modal-nueva-afectacion')
    },
    cancelado () {
      this.$bvModal.hide('modal-nueva-afectacion')
    },
    limpiarModalAfectacion () {
      this.afectacionPoliza.pol_affe_id = null
      this.afectacionPoliza.pol_affe_pol_id = null
      this.afectacionPoliza.pol_affe_prore_id = null
      this.afectacionPoliza.pol_affe_valor_bruto = null
      this.afectacionPoliza.pol_affe_valor_deducible = null
      this.afectacionPoliza.pol_affe_valor_neto = null
      this.afectacionPoliza.pol_affe_fecha = null
      this.afectacionPoliza.pol_affe_user_id = null
    },
    editAfectacion (llave) {
      this.afectacionPoliza.pol_affe_id = this.afectacionesPoliza[llave].pol_affe_id
      this.afectacionPoliza.pol_affe_pol_id = this.afectacionesPoliza[llave].pol_affe_pol_id
      this.afectacionPoliza.pol_affe_prore_id = this.afectacionesPoliza[llave].pol_affe_prore_id
      this.afectacionPoliza.pol_affe_valor_bruto = this.afectacionesPoliza[llave].pol_affe_valor_bruto
      this.afectacionPoliza.pol_affe_valor_deducible = this.afectacionesPoliza[llave].pol_affe_valor_deducible
      this.afectacionPoliza.pol_affe_valor_neto = this.afectacionesPoliza[llave].pol_affe_valor_neto
      this.afectacionPoliza.pol_affe_fecha = this.afectacionesPoliza[llave].pol_affe_fecha
      this.afectacionPoliza.pol_affe_user_id = this.afectacionesPoliza[llave].pol_affe_user_id
      this.$bvModal.show('modal-nueva-afectacion')
    },
    deleteAfectacion (afectacionId) {
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar esta afectación?', {
        title: 'Por favor confirmar acción',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Confirmar',
        cancelTitle: 'Cancelar',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            this.confirmDeleteAfectacion(afectacionId)
          }
        })
        .catch(err => {
          Vue.swal(err)
        })
    },
    confirmDeleteAfectacion (afectacionId) {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.user_id = this.userLogged.usr_id
      }
      axios.post('/policyAffectation/delete/' + afectacionId + '/' + this.user_id).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal(res.data.message)
          this.getPolicy()
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          Vue.swal('Algo salio mal ' + err)
        })
    },
    agregarProceso () {
      this.intentos = 1
    },
    irProceso (proreId) {
      let editar = false
      this.$router.push({ path: `/process/process-show/${proreId}/${editar}` })
    },
    transformarBoolean (edicion) {
      if (edicion === 'true') {
        this.editando = true
      } else {
        this.editando = false
      }
    },
    valorNetoAfectacion () {
      let valorBruto = this.afectacionPoliza.pol_affe_valor_bruto > 0 ? this.afectacionPoliza.pol_affe_valor_bruto : 0
      let deducible = this.afectacionPoliza.pol_affe_valor_deducible > 0 ? this.afectacionPoliza.pol_affe_valor_deducible : 0
      this.afectacionPoliza.pol_affe_valor_neto = parseInt(valorBruto) - parseInt(deducible)
    },
    formatPrice (value) {
      if (value != null && value !== '') {
        let val = (value / 1).toFixed(0).replace('.', ',')
        return '$ ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      } else {
        return '$0'
      }
    }
  }
}
</script>
