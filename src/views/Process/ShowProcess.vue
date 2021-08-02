<template>
  <b-container fluid>
    <section>
      <div class="py-5" v-if="prore_id !== undefined && loading">
        <b-progress :max="max" height="2rem">
          <b-progress-bar :progress_total="progress_total" variant="success" :style="{width: progress_total + '%'}">
            <span><b>{{ progress_total }}%</b></span>
          </b-progress-bar>
        </b-progress>
      </div>
      <div v-else>
        <!-- INICIAL DE MODAL DE ACTUACIÓN -->
        <div>
          <b-modal id="modal-nueva-actuacion" size="lg" title="Agregar actuación" hide-footer>
            <form ref="form">
              <p v-if="errors.length">
                <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>
              <b-row>
                <b-col md="4">
                  <b-form-group label="Asignar Abogada/o*" label-for="agen_pro_id">
                    <b-form-select plain v-model="proceeding.proce_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione abogado</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Tipo de actuación*" label-for="proce_sta_id">
                    <b-form-select plain v-model="proceeding.proce_sta_id" :options="statusProcessOptions" id="proce_sta_id">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione un estado</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Fecha de ingreso*" label-for="proce_fecha_ingreso">
                    <b-form-input id="proce_fecha_ingreso" v-model="proceeding.proce_fecha_ingreso" type="date" ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="4">
                  <b-form-group label="Fecha de actualización*" label-for="proce_fecha_actualizacion">
                    <b-form-input id="proce_fecha_actualizacion" v-model="proceeding.proce_fecha_actualizacion" type="date"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Fecha de siguiente audiencia" label-for="proce_fecha_siguiente_audiencia">
                    <b-form-input id="proce_fecha_siguiente_audiencia" v-model="proceeding.proce_fecha_siguiente_audiencia" type="date"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Hora de siguiente audiencia" label-for="proce_hora_siguiente_audiencia">
                    <b-form-input id="proce_hora_siguiente_audiencia" v-model="proceeding.proce_hora_siguiente_audiencia" type="time"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-textarea v-model="proceeding.proce_descripcion" type="text" placeholder="Descripción de la actuación*"></b-form-textarea>
                </b-col>
              </b-row>
              <b-row>
                <b-col col-auto>
                  <b-form-group  label="Nombre del link" label-for="link_proce_id">
                    <b-form-input v-model="nuevoLinkProceeding.link_name" type="text" placeholder="Página de Google"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col col-auto>
                  <b-form-group  label="URL del link" label-for="imp_nombres">
                    <b-form-input v-model="nuevoLinkProceeding.link_url" type="text" placeholder="www.google.com.co"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col class="text-left col-auto">
                  <b-form-group  label=" " label-for="link_proce_id">
                    <a style="pointer-events:all;" href="#" @click="agregarLinkProceeding"><i class="ri-add-circle-line" style="font-size: 40px;color: green;"></i></a>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <div v-if="linksProceeding !== undefined && linksProceeding !==''">
                    <b-table :items="linksProceeding" :fields="columnasLinkActuacion" stacked="md" small>
                      <template #cell(name)="row">
                        {{ row.value.first }} {{ row.value.last }}
                      </template>
                      <template #cell(actions)="row">
                        <b-button size="sm" variant="danger" @click="deleteLinkProceeding(row.index)" :class="estadoBotonEliminarLinkProceeding"> Remover </b-button>
                      </template>
                    </b-table>
                    <hr>
                  </div>
                </b-col>
              </b-row>
              <div class="text-right pt-1">
                <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-nueva-actuacion')">Cancelar</b-button>
                <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarActuacion">{{ textoGuardarModal }}</b-button>
              </div>
            </form>
          </b-modal>
        </div>
        <!-- FIN MODAL DE NUEVA ACTUACIÓN -->
        <!-- INICIO DE MODAL DE AGREGAR IMPLICADO -->
        <div>
          <b-modal id="modal-nuevo-implicated" size="lg" title="Agregar/Editar involucrado" hide-footer>
            <form ref="form">
              <p v-if="errors.length">
                <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>
              <b-row>
                <b-col md="3">
                  <b-form-group label="Tipo de identificación" label-for="imp_tipo_identificacion">
                    <b-form-select plain v-model="nuevoImplicated.imp_tipo_identificacion" :options="tipoIdentificacionOptions" id="imp_tipo_identificacion">
                      <template v-slot:first>
                        <b-form-select-option :value="null">Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Identificación" label-for="imp_identificacion">
                    <b-form-input v-model="nuevoImplicated.imp_identificacion" type="text" placeholder="Identificación"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Nombres/Razón social*" label-for="imp_nombres">
                    <b-form-input v-model="nuevoImplicated.imp_nombres" type="text" placeholder="Nombres"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Apellidos" label-for="imp_apellidos">
                    <b-form-input v-model="nuevoImplicated.imp_apellidos" type="text" placeholder="Apellidos"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="4">
                  <b-form-group label="Rango de edad" label-for="imp_rango_edad">
                    <b-form-select plain v-model="nuevoImplicated.imp_rango_edad" :options="rangoEdadOptions" id="imp_rango_edad">
                      <template v-slot:first>
                        <b-form-select-option :value="null">Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Genero" label-for="imp_genero_id">
                    <b-form-select plain v-model="nuevoImplicated.imp_genero_id" :options="generoOptions" id="imp_genero_id">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Dirección residencia" label-for="imp_direccion">
                    <b-form-input id="imp_direccion" v-model="nuevoImplicated.imp_direccion" type="text"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Perfil*" label-for="imp_profile_id">
                    <b-form-select plain v-model="nuevoImplicated.imp_profile_id" :options="profilesOptions" id="imp_profile_id">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Teléfonos" label-for="imp_telefonos">
                    <b-form-input v-model="nuevoImplicated.imp_telefonos" type="text" placeholder="Ej 3176669800, 3110910092"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Correos" label-for="imp_emails">
                    <b-form-input v-model="nuevoImplicated.imp_emails" type="text" placeholder="Ej hola@example.com, prueba@example.com" ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="text-right pt-1">
                <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-nuevo-implicated')">Cancelar</b-button>
                <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarImplicated">{{ textoGuardarModal }}</b-button>
              </div>
            </form>
          </b-modal>
        </div>
        <!-- FIN MODAL DE NUEVO IMPLICADO -->
        <b-row>
          <b-col lg="12">
            <iq-card body-class="p-0">
              <template v-slot:body>
                <div class="iq-edit-list">
                  <tab-nav :pills="true" class="iq-edit-profile d-flex">
                    <tab-nav-items class="col-auto p-0" :active="true" href="#personal-information" title="Info proceso" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#involucrados" title="Involucrados" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#actuaciones" title="Actuaciones" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#costos-cuantias" title="Costos/Cuantías" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#poliza" title="Poliza" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#comentarios" title="Comentarios" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#notas" title="Notas" />
                    <tab-nav-items class="col-auto p-0" :active="false" href="#links" title="Links" />
                  </tab-nav>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="12" class="pagina-detalle-proceso">
            <div class="iq-edit-list-data">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="personal-information" >
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Información del proceso</h4>
                    </template>
                    <template v-slot:headerAction>
                      <b-button variant="secondary" class="mr-2" v-if="editando" @click="cancelarEdicionProceso">Cancelar</b-button>
                      <b-button variant="primary" :class="estadoBotonActualizarProceso" @click="editarProceso">{{ textoEditarProceso }}</b-button>
                    </template>
                    <template v-slot:body>
                      <div v-if="!editando">
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="my-0 pr-3"><b>Etapa procesal: </b><span v-if="process.proceedings[0] != null">{{ process.proceedings[0].status_process.sta_name }}</span></b-card-text>
                          <b-card-text class="my-0 pr-3" v-if="process.proceedings[0] != null && process.proceedings[0].status_process.sta_id ===  15"><b>Fecha terminación: </b><span >{{ process.proceedings[0].proce_fecha_ingreso }}</span></b-card-text>

                          <b-card-text class="pr-3 my-0"><b>ID Litigando: </b><span v-if="process.prore_litigando_id != null">{{ process.prore_litigando_id }} </span><span class="text-danger" v-if="process.prore_litigando_id == null">Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3"><b>Número de Radicado:</b> <span v-if="process.prore_num_radicado != null">{{ process.prore_num_radicado }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b>Abogado Líder:</b>
                        <b-row class="col-md-12 pt-1" v-if="process.professional != null">
                          <b-card-text class="pr-3 my-0"><b>Nombre: </b>{{ process.professional.pro_name_first }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Apellido: </b>{{ process.professional.pro_lastname_first }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Identificación: </b>{{ process.professional.pro_identificacion }}</b-card-text>
                          <b-card-text class="my-0"><b>Correo electrónico: </b>{{ process.professional.pro_email }}</b-card-text>
                        </b-row>
                        <hr>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Tipo de proceso: </b><span v-if="process.tipo_proceso != null">{{ process.tipo_proceso.typro_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Juzgado: </b><span v-if="process.juzgado != null">{{ process.juzgado.court_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="my-0 pr-3"><b>Número radicado: </b><span v-if="process.prore_num_radicado != null">{{ process.prore_num_radicado }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Proceso Ejecutivo:</b> <span v-if="process.prore_proceso_ejecutivo != null">{{ process.prore_proceso_ejecutivo }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Ejecutante:</b> <span v-if="process.prore_ejecutante != null">{{ process.prore_ejecutante }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Medida Cautelar:</b> <span v-if="process.prore_medida_cautelar != null">{{ process.prore_medida_cautelar }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Ciudad:</b> <span v-if="process.ciudad != null">{{ process.ciudad.city_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha ingreso: </b>{{ process.prore_fec_ingreso }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Clinica:</b> <span v-if="process.clinica != null">{{ process.clinica.cli_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha siniestro: </b>{{ process.prore_fec_sinister }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Fecha aviso:</b> {{ process.prore_fec_sinies_aviso }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha de notificación IPS:</b> {{ process.prore_fec_recibo_notify }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Colaborador de IPS:</b> {{ process.prore_colaborador_ips }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Año de notificación: </b>{{ process.prore_year_notify }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha notificación prejudicial: </b>{{ process.prore_fec_noti_preju }}</b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Fecha notificación prejudicial:</b> {{ process.prore_fec_audi_conci_preju }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text><b>Descripción del siniestro: </b>{{ process.prore_sinies_description }}</b-card-text>
                        </b-row>
                        <hr>
                        <b style="text-decoration:underline;">Conclusiones:</b>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Sentencia Final: </b><span v-if="process.prore_sentencia_final != null">{{ process.prore_sentencia_final }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Valor De La Sentencia Final: </b><span v-if="process.prore_val_sentencia_final != null">{{ process.prore_val_sentencia_final }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Discriminar Valor De La Condena:</b> <span v-if="process.prore_discriminar_val_condena != null">{{ process.prore_discriminar_val_condena }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="pr-3 my-0"><b>Costas De La Sentencia: </b><span v-if="process.prore_costas_sentencia != null">{{ process.prore_costas_sentencia }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Costas Procesales Primera Instancia: </b><span v-if="process.prore_costas_procesales_primera_instancia != null">{{ process.prore_costas_procesales_primera_instancia }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Costas Procesales Segunda Instancia:</b> <span v-if="process.prore_costas_procesales_segunda_instancia != null">{{ process.prore_costas_procesales_segunda_instancia }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text class="pr-3 my-0"><b>Total Costas: </b><span v-if="process.prore_total_costas != null">{{ process.prore_total_costas }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-row>
                      </div>
                      <div v-else>
                        <b-row>
                          <b-form-group class="col-md-6" label="Número de radicado*" label-for="prore_num_radicado">
                            <div>
                              <b-form-input id="prore_num_radicado" v-model="process.prore_num_radicado" type="text"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Identificador de litigando*" label-for="prore_litigando_id">
                            <div>
                              <b-form-input v-model="process.prore_litigando_id" id="prore_litigando_id" type="number"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha de Ingreso a Juridico*" label-for="prore_fec_ingreso_jur">
                            <div>
                              <b-form-input id="prore_fec_ingreso_jur" v-model="process.prore_fec_ingreso_jur" type="date"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha Traslado Decreto 806" label-for="prore_fec_ingreso">
                            <div>
                              <b-form-input id="prore_fec_ingreso" v-model="process.prore_fec_ingreso" type="date" ></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Clinica/IPS*" label-for="prore_defendant_clin">
                            <div>
                              <b-form-select plain v-model="process.prore_defendant_clin" :options="clinicaOptions" @search="fetchOptionsClinicas" id="prore_defendant_clin" >
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una clinica</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Tipo de Proceso" label-for="prore_typro_id">
                            <div>
                              <b-form-select plain v-model="process.prore_typro_id" :options="typeProcessOptions" id="prore_typro_id" >
                                <template v-slot:first>
                                  <b-form-select-option :value="null">Seleccione un tipo de Proceso</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Año del Siniestro*" label-for="prore_year_sinister">
                            <div>
                              <b-form-select plain v-model="process.prore_year_sinister" :options="years" id="prore_year_sinister">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha del Siniestro*" label-for="prore_fec_sinister">
                            <div>
                              <b-form-input id="prore_fec_sinister" v-model="process.prore_fec_sinister" type="date" :format="{ year }" ></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Año de notificación*" label-for="prore_year_notify">
                            <div>
                              <b-form-select plain v-model="process.prore_year_notify" :options="years" id="selectyearnotify">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Año del proceso*" label-for="prore_process_year">
                            <div>
                              <b-form-select plain v-model="process.prore_process_year" :options="years" id="selectyearnotify">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una fecha</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha de notificación prejudicial" label-for="prore_fec_noti_preju">
                            <div>
                              <b-form-input id="exampleInputdate" v-model="process.prore_fec_noti_preju" type="date"></b-form-input>
                              </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha de la audiencia de conciliación prejudicial*" label-for="prore_fec_audi_conci_preju">
                            <div>
                              <b-form-input id="exampleInputdate" v-model="process.prore_fec_audi_conci_preju" type="date"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha aviso del siniestro" label-for="prore_fec_sinies_aviso">
                            <div>
                              <b-form-input id="exampleInputdate" v-model="process.prore_fec_sinies_aviso" type="date"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Juzgado" label-for="prore_court_id">
                            <div>
                              <b-form-select plain v-model="process.prore_court_id" :options="courtsOptions" id="selectuserrole" >
                                <template v-slot:first>
                                  <b-form-select-option :value="null">Seleccione un juzgado</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                            <b-card-text class="texto-tipo-boton text-dark" v-b-modal.modal-crear-juzagado>Crear juzgado</b-card-text>
                          </b-form-group>
                          <b-modal
                            id="modal-crear-juzagado"
                            ref="modal"
                            title="Agregar juzgado"
                            hide-footer
                          >
                            <form ref="form">
                              <b-form-group
                                label="Nombre del juzgado"
                                label-for="name-input"
                              >
                                <b-form-input
                                  id="name-input"
                                  v-model="nuevo_court.name"
                                ></b-form-input>
                              </b-form-group>
                              <b-form-group label="Teléfono del juzgado">
                                <b-form-input v-model="nuevo_court.telefono" type="text" placeholder="ej: 3015456561"></b-form-input>
                              </b-form-group>
                              <b-form-group label="Correo del juzgado">
                                <b-form-input v-model="nuevo_court.email" type="email" placeholder="info@example.com"></b-form-input>
                              </b-form-group>
                              <div class="text-right pt-1">
                                <b-button class="sm-3 mr-1" variant="secondary" @click="$bvModal.hide('modal-crear-juzagado')">Cancelar</b-button>
                                <b-button class="sm-3" variant="primary" :class="botonGuardarModal" @click="guardarJuzgado">{{ textoGuardarModal }}</b-button>
                              </div>
                            </form>
                          </b-modal>
                          <b-form-group class="col-md-6" label="Descripción del siniestro*" label-for="prore_sinies_description">
                            <div>
                              <b-form-textarea v-model="process.prore_sinies_description" type="text" placeholder="Descripción"></b-form-textarea>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Patología" label-for="patologia">
                            <div>
                              <b-form-input type="text" v-model="process.prore_pathology" placeholder="Patología"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Proceso Ejecutivo" label-for="prore_proceso_ejecutivo">
                            <b-form-input v-model="process.prore_proceso_ejecutivo" type="text" placeholder="Proceso Ejecutivo"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Ejecutante" label-for="prore_ejecutante">
                            <b-form-input v-model="process.prore_ejecutante" type="text" placeholder="Ejecutante"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha de recibo de notificación IPS" label-for="prore_fec_recibo_notify">
                            <div>
                              <b-form-input id="exampleInputdate" v-model="process.prore_fec_recibo_notify" type="date"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Colaborador de IPS que recibe notificación" label-for="prore_colaborador_ips">
                            <div>
                              <b-form-input type="text" v-model="process.prore_colaborador_ips" placeholder="Nombre completo colaborador"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Fecha de Ingreso a Clínica*" label-for="prore_fec_ingreso_cli">
                            <div>
                              <b-form-input id="prore_fec_ingreso_cli" v-model="process.prore_fec_ingreso_cli" type="date"></b-form-input>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Ciudad*" label-for="prore_city_id">
                            <div>
                              <b-form-select plain v-model="process.prore_city_id" :options="citiesOptions" id="select_city">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una Ciudad</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Especialidad" label-for="selectuserrole">
                            <div>
                              <b-form-select plain v-model="process.prore_propse_id" :options="especialidadesOptions" id="select_especialidad">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una especialidad</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Asignar Abogada/o" label-for="prore_pro_id">
                            <div>
                              <b-form-select plain v-model="process.prore_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
                                <template v-slot:first>
                                  <b-form-select-option :value="null">Seleccione un abogado</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Riesgo NIIF" label-for="risk_id">
                            <div>
                              <b-form-select plain v-model="process.prore_risk_id" :options="risksOptions" @search="fetchRisks" id="risk_id">
                                <template v-slot:first>
                                  <b-form-select-option :value="null">Seleccione el riesgo NIIF</b-form-select-option>
                                </template>
                              </b-form-select>
                            </div>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Sentencia Final" label-for="prore_sentencia_final">
                            <b-form-select plain v-model="process.prore_sentencia_final" id="prore_sentencia_final">
                              <template v-slot:first>
                                <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                <b-form-select-option :value="'Ninguna'">Ninguna</b-form-select-option>
                                <b-form-select-option :value="'A Favor'" >A Favor</b-form-select-option>
                                <b-form-select-option :value="'En Contra'">En Contra</b-form-select-option>
                              </template>
                            </b-form-select>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Valor De La Sentencia Final" label-for="prore_val_sentencia_final">
                            <b-form-input id="prore_val_sentencia_final" v-model="process.prore_val_sentencia_final" type="number" placeholder="$"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Discriminar Valor De La Condena" label-for="prore_discriminar_val_condena">
                            <b-form-input id="prore_discriminar_val_condena" v-model="process.prore_discriminar_val_condena" type="number" placeholder="$"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Costas De La Sentencia" label-for="prore_costas_sentencia">
                            <b-form-input id="prore_costas_sentencia" v-model="process.prore_costas_sentencia" type="number" placeholder="$"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Costas Procesales Primera Instancia" label-for="prore_costas_procesales_primera_instancia">
                            <b-form-input id="prore_costas_procesales_primera_instancia" v-model="process.prore_costas_procesales_primera_instancia" type="number" placeholder="$"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Costas Procesales Segunda Instancia" label-for="prore_costas_procesales_segunda_instancia">
                              <b-form-input id="prore_costas_procesales_segunda_instancia" v-model="process.prore_costas_procesales_segunda_instancia" type="number" placeholder="$"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Total Costas" label-for="prore_total_costas">
                            <b-form-input id="prore_total_costas" v-model="process.prore_total_costas" type="number" placeholder="$"></b-form-input>
                          </b-form-group>
                        </b-row>
                      </div>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="involucrados">
                  <iq-card :key="implicatedKey">
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Involucrados en el proceso</h4>
                    </template>
                    <template v-slot:headerAction>
                      <button class="btn btn-primary" @click="agregarImplicated"><i class="ri-add-line mr-2" ></i>Añadir nuevo involucrado</button>
                    </template>
                    <template v-slot:body>
                      <b-row class="col-md-12" v-for="(implicate, index) in implicateds" :key="index">
                        <b-row class="col-md-12 pt-1">
                          <h6><b class="text-black" style="text-decoration:underline;">{{ implicate.profile.prof_name }}</b><button class="btn btn-link pt-0" @click="editImplicated(index)"><i class="ri-edit-2-fill"></i>Editar</button> <button @click="deleteImplicated(implicate)" class="btn btn-link pt-0 px-0 text-danger"><i class="ri-delete-bin-6-fill"></i>Eliminar</button></h6>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="px-2 my-0"><b>Tipo identificación: </b>{{ tipoIdentificacion(implicate.imp_tipo_identificacion) }}</b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Identificación: </b>{{ implicate.imp_identificacion }}</b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Nombres: </b>{{ implicate.imp_nombres }}</b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Apellidos: </b>{{ implicate.imp_apellidos }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="px-2 my-0"><b>Edad o rango de edad: </b><span v-if="implicate.imp_edad > 0">{{ implicate.imp_edad }}</span><span v-else>{{ implicate.imp_rango_edad }}</span></b-card-text>
                          <b-card-text class="pr-2 my-0"><b>Genero: </b>{{ generoInvolucrado(implicate.imp_genero_id) }}</b-card-text>
                          <b-card-text class="px-2 my-0"><b>Dirección: </b>{{ implicate.imp_direccion }}</b-card-text>
                        </b-row>
                        <b-row class="col-md-12 pt-1">
                          <b-card-text class="px-2 my-0"><b>Teléfonos: </b>{{ implicate.imp_telefonos }}</b-card-text>
                          <b-card-text class="pl-3 my-0"><b>Emails: </b>{{ implicate.imp_emails }}</b-card-text>
                          <b-card-text class="pl-3 my-0"><b>ID Proceso: </b>{{ implicate.imp_process_request_id }}</b-card-text>
                        </b-row>
                      </b-row>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="actuaciones">
                  <iq-card :key="proceedingKey">
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Actuaciones</h4>
                    </template>
                    <template v-slot:headerAction>
                      <button class="btn btn-primary" @click="agregarActuacion"><i class="ri-add-line mr-2" ></i>Agregar actuación</button>
                    </template>
                    <template v-slot:body>
                      <ul class="iq-timeline">
                        <li class="col-md-12" v-for="(proceeding, index) in proceedings" :key="index">
                          <div class="timeline-dots border-primary" v-if="index == 0" :class="'border-primary'"></div>
                          <div class="timeline-dots border-primary" v-else :class="'border-warning'"></div>
                          <h6 class="float-left mb-1 font-weight-bolder">{{ proceeding.status_process.sta_name }}<button class="btn btn-link pt-0" @click="editProceeding(index)"><i class="ri-edit-2-fill"></i>Editar</button> <button @click="deleteProceeding(proceeding.proce_id)" class="btn btn-link pt-0 px-0 text-danger"><i class="ri-delete-bin-6-fill"></i>Eliminar</button></h6>
                          <!--<b-row class="col-md-12 pl-0 pt-1">
                            <h6><b class="text-black" style="text-decoration:underline;">{{ proceeding.status_process.sta_name }}</b> <button class="btn btn-link" @click="editProceeding(index)"><i class="ri-edit-2-fill"></i>Editar</button> <button class="btn btn-link px-0 text-danger"><i class="ri-edit-2-fill"></i>Eliminar</button></h6>
                          </b-row>-->
                          <b-row class="col-md-12 pt-1">
                            <b-card-text class="my-0"><b>Abogado: </b><span v-if="proceeding.professional != null">{{ proceeding.professional.pro_name_first }} {{ proceeding.professional.pro_lastname_first }}</span></b-card-text>
                            <b-card-text class="pl-3 my-0"><b>Fecha de registro: </b>{{ proceeding.proce_fecha_ingreso }}</b-card-text>
                            <b-card-text class="pl-3 my-0"><b>Fecha sig. audiencia: </b>{{ proceeding.proce_fecha_siguiente_audiencia }}</b-card-text>
                            <b-card-text class="my-0"><b>Hora sig. audiencia: </b>{{ proceeding.proce_hora_siguiente_audiencia }}</b-card-text>
                          </b-row>
                          <b-row class="col-md-12 pt-1">
                            <b-card-text><b>Descripción actuación: </b>{{ proceeding.proce_descripcion }}</b-card-text>
                          </b-row>
                          <b-row class="col-md-12 pt-1">
                            <b>Links </b>
                            <b-card-text class="pl-1" v-for="(link_proceeding, index_link) in proceeding.links" :key="index_link">
                              <a v-bind:href="link_proceeding.link_url" target="_blank">{{ link_proceeding.link_name }}</a><span v-if="(index_link+1) < proceeding.links.length">,</span>
                            </b-card-text>
                          </b-row>
                        </li>
                      </ul>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="costos-cuantias">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Costos y cuantías</h4>
                    </template>
                    <template v-slot:body>
                      <b-row>
                        <b-col md="6">
                          <b-card-text><b>Pretensiones/Capital/Interes/Honorarios:</b> <span v-if="process.prore_pretenciones_cap_int_hon != null">{{ process.prore_pretenciones_cap_int_hon }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Pretensiones Laborales:</b> <span v-if="process.prore_pretenciones_laborales != null">{{ process.prore_pretenciones_laborales }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Pretensiones Sociales:</b> <span v-if="process.prore_prestaciones_sociales != null">{{ process.prore_prestaciones_sociales }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Pretensiones por Vacaciones:</b> <span v-if="process.prore_pretenciones_vacaciones != null">{{ process.prore_pretenciones_vacaciones }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Pretensiones por Indemnización:</b> <span v-if="process.prore_pretenciones_indemnizacion != null">{{ process.prore_pretenciones_indemnizacion }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Pago de Seguridad Social en Salud:</b> <span v-if="process.prore_pago_seguridad_social_sa != null">{{ process.prore_pago_seguridad_social_sa }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Salarios dejados de Percibir:</b> <span v-if="process.prore_salario_dejados_percibir != null">{{ process.prore_salario_dejados_percibir }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Otros:</b> <span v-if="process.prore_otros_valores != null">{{ process.prore_otros_valores }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Valor Lucro Cesante:</b> <span v-if="process.prore_val_luc_cesante != null">{{ process.prore_val_luc_cesante }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Valor Daño Emergente:</b> <span v-if="process.prore_val_dano_emergente != null">{{ process.prore_val_dano_emergente }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-col>
                        <b-col md="6">
                          <b-card-text><b>Total Perjuicios Materiales:</b> <span v-if="process.prore_total_perjuicios_materiales != null">{{ process.prore_total_perjuicios_materiales }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Estimado a Pagar Por Perjuicios Mat.:</b> <span v-if="process.prore_estimacion_pago_perju_materiales != null">{{ process.prore_estimacion_pago_perju_materiales }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Valor Que Cubre La Poliza Por Perjuicios Mat.:</b> <span v-if="process.prore_val_cubre_poliza_perjuicios_mat != null">{{ process.prore_val_cubre_poliza_perjuicios_mat }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Valor Daño Moral:</b> <span v-if="process.prore_val_dano_moral != null">{{ process.prore_val_dano_moral }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Daño a la Vida ó Prejuicios Fisiologicos y Otros:</b> <span v-if="process.prore_val_dano_vida != null">{{ process.prore_val_dano_vida }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Total Perjuicios Inmateriales:</b> <span v-if="process.prore_total_perjuicios_inmateriales != null">{{ process.prore_total_perjuicios_inmateriales }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Estimado a Pagar Por Perjuicios Inmat.:</b> <span v-if="process.prore_estimacion_pago_perju_inmateriales != null">{{ process.prore_estimacion_pago_perju_inmateriales }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Valor que Cube la Poliza Prejuicios Inmat.:</b> <span v-if="process.prore_val_cubre_poliza_perjuicios_inmat != null">{{ process.prore_val_cubre_poliza_perjuicios_inmat }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Cuantía de las Pretensiones:</b> <span v-if="process.prore_cuantia_pretenciones != null">{{ process.prore_cuantia_pretenciones }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                          <b-card-text><b>Valor a Provisionar:</b> <span v-if="process.prore_valor_provisionar != null">{{ process.prore_valor_provisionar }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        </b-col>
                      </b-row>
                      <hr>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="poliza">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Datos de la poliza</h4>
                    </template>
                    <template v-slot:body>
                      <b-row class="col-md-12 pt-1">
                        <b-card-text class="my-0"><b>Aseguradora :</b><span v-if="process.aseguradora != null">{{ process.aseguradora.ase_name }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        <b-card-text class="pl-3 my-0"><b>Monto Total Asegurado: </b> <span v-if="process.prore_val_total_asegurado != null">{{ process.prore_val_total_asegurado }} </span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        <b-card-text class="pl-3"><b>Si La Poliza Fue Afectada Por Que Valor:</b> <span v-if="process.prore_val_afectado_poliza != null">{{ process.prore_val_afectado_poliza }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                      </b-row>
                      <b-row class="col-md-12 pt-1">
                        <b-card-text class="my-0"><b>Deducible :</b><span v-if="process.prore_deducible != null">{{ process.prore_deducible }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        <b-card-text class="pl-3 my-0"><b>Cobertura Actual Poliza: </b> <span v-if="process.prore_val_cobertura_poliza != null">{{ process.prore_val_cobertura_poliza }} </span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        <b-card-text class="pl-3"><b>Provisiones Constituidas:</b> <span v-if="process.prore_val_provisiones_constituidas != null">{{ process.prore_val_provisiones_constituidas }}</span><span class="text-danger" v-else>Sin asignar</span></b-card-text>
                        <b-card-text class="pl-3"><b>Prescritas:</b> <span v-if="process.prore_prescritas != 1">No</span><span v-else>Si</span></b-card-text>
                      </b-row>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="comentarios">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Comentarios</h4>
                    </template>
                    <template v-slot:body>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="notas">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Notas</h4>
                    </template>
                    <template v-slot:body>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="links">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Links</h4>
                    </template>
                    <template v-slot:headerAction>
                      <b-button variant="primary" @click="agregarLink"><i class="ri-add-line mr-2" ></i>Agregar link</b-button>
                    </template>
                    <template v-slot:body>
                      <b-table bordered hover foot-clone :items="links" :fields="columnasLinks" :key="tableLinkKey" stacked="md" small >
                        <template v-slot:cell(link_name)="row">
                          <span v-if="!row.item.editable">{{ row.item.link_name }}</span>
                          <input type="text" v-model="row.item.link_name" v-else class="form-control">
                        </template>
                        <template v-slot:cell(link_url)="row">
                          <a style="word-break: break-all;" v-bind:href="row.item.link_url" target="_blank" v-if="!row.item.editable">{{ row.item.link_url }}</a>
                          <input type="text" v-model="row.item.link_url" v-else class="form-control">
                        </template>
                        <template #cell(actions)="row">
                          <!--<b-button class="mr-1" size="sm" variant="primary" @click="editLink(row.index)" :class="estadoBotonEliminarLinkProceeding"> Editar </b-button>
                          <b-button size="sm" variant="danger" @click="deleteLink(row.index)" :class="estadoBotonEliminarLinkProceeding"> Remover </b-button>-->
                          <b-button variant=" iq-bg-success mr-1 mb-1" size="sm" @click="editLink(row.item)" v-if="!row.item.editable"><i class="ri-ball-pen-fill m-0"></i></b-button>
                          <b-button variant=" iq-bg-success mr-1 mb-1" size="sm" @click="submitLink(row.item)" v-else>Ok</b-button>
                          <b-button variant=" iq-bg-info mr-1 mb-1" size="sm" v-if="row.item.editable" @click="cancelEditLink(row.item)">Cancelar</b-button>
                          <b-button variant=" iq-bg-danger" size="sm" @click="removeLink(row.item)"><i class="ri-delete-bin-line m-0"></i></b-button>
                        </template>
                      </b-table>
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
import { required } from 'vuelidate/lib/validators'
import Vue from 'vue'
import axios from 'axios'
import auth from '@/logic/auth'

export default {
  name: 'ProfileEdit',
  mounted () {
    xray.index()
    this.getProcess()
    this.barraCargando()
    setTimeout(() => {
      this.getTypeNotifications()
      this.getEstadosProceso()
      this.fetchOptionsAbogados()
      this.fetchProfiles()
      setTimeout(() => {
        this.fetchEspecialidades()
        this.fetchOptionsClinicas()
        this.fetchCourts()
        this.fetchRisks()
        this.fetchTypeProcess()
        this.fetchCity()
      }, 800)
    }, 500)
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    },
    years () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 1995 }, (value, index) => 2000 + index)
    }
  },
  data () {
    return {
      estadoBotonActualizarProceso: '',
      textoEditarProceso: 'Editar Proceso',
      user_id: null,
      estadoBotonEliminarLinkProceeding: '',
      intentos: 0,
      prore_id: this.$route.params.prore_id,
      editando: this.$route.params.editar,
      implicateds: [],
      process: [],
      loading: true,
      progress_total: 4,
      max: 100,
      botonGuardarModal: '',
      textoGuardarModal: 'Guardar',
      errors: [],
      validationRules: [
        {
          prore_num_radicado: { required },
          prore_fec_ingreso_jur: { required },
          prore_defendant_clin: { required },
          prore_year_sinister: { required },
          prore_fec_sinister: { required },
          prore_year_notify: { required },
          prore_process_year: { required },
          prore_fec_audi_conci_preju: { required },
          prore_sinies_description: { required },
          prore_fec_ingreso_cli: { required },
          prore_city_id: { required },
          prore_litigando_id: { required }
        }
      ],
      proceeding: {
        proce_id: null,
        proce_prore_id: null,
        proce_pro_id: null,
        proce_sta_id: null,
        proce_fecha_ingreso: null,
        proce_fecha_actualizacion: null,
        proce_descripcion: null,
        proce_fecha_siguiente_audiencia: null,
        proce_hora_siguiente_audiencia: null
      },
      nuevoLinkProceeding: {
        link_name: null,
        link_url: null
      },
      nuevoLink: {
        link_name: '',
        link_url: '',
        link_prore_id: this.$route.params.prore_id
      },
      proceedingKey: 1,
      tableLinkKey: 1,
      implicatedKey: 1,
      agenda: {
        agen_name: '',
        agen_pro_id: '',
        agen_start_date: '',
        agen_end_date: '',
        sch_start_hour: '',
        sch_end_hour: '',
        agen_type_eve_id: '',
        agen_type_not_id: ''
      },
      proceedings: [],
      statusProcessOptions: [],
      linksProceeding: [],
      columnasLinkActuacion: [
        { key: 'link_name', label: 'Nombre', class: 'text-center' },
        { key: 'link_url', label: 'URL', class: 'text-center' },
        { key: 'actions', label: 'Acciones', class: 'text-center' }
      ],
      columnasLinks: [
        { key: 'link_name', label: 'Nombre', class: 'text-left' },
        { key: 'link_url', label: 'URL', class: 'text-left' },
        { key: 'actions', label: 'Acciones', class: 'text-center' }
      ],
      typeNotificationsOptions: [],
      abogadoOptions: [],
      tipoIdentificacionOptions: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 },
        { text: 'NIT', value: 4 }
      ],
      nuevoImplicated: {
        imp_tipo_identificacion: '',
        imp_identificacion: '',
        imp_nombres: '',
        imp_apellidos: '',
        imp_direccion: '',
        imp_rango_edad: '',
        imp_telefonos: '',
        imp_emails: '',
        imp_profile_id: '',
        imp_genero_id: '',
        imp_process_request_id: this.$route.params.prore_id
      },
      generoOptions: [
        {
          text: 'No aplica',
          value: null
        },
        {
          text: 'Masculino',
          value: 2
        },
        {
          text: 'Femenino',
          value: 1
        }
      ],
      rangoEdadOptions: [
        {
          text: '0-18 años',
          value: '0-18 años'
        },
        {
          text: '19- 60 años',
          value: '19- 60 años'
        },
        {
          text: '+ 60 años',
          value: '+ 60 años'
        },
        {
          text: 'No aplica',
          value: 'No aplica'
        }
      ],
      year: null,
      clinicaOptions: [],
      citiesOptions: [],
      especialidadesOptions: {},
      typeProcessOptions: {},
      courtsOptions: {},
      risksOptions: {},
      profilesOptions: {},
      nuevo_court: {
        name: '',
        telefono: '',
        email: ''
      },
      errores: {}
    }
  },
  methods: {
    barraCargando () {
      let vm = this
      let timer = setInterval(function () {
        vm.progress_total += 4
        if (vm.progress_total > 99) clearInterval(timer)
      }, 100)
    },
    fetchCity () {
      axios.get('/cities/fetch').then(response => {
        this.citiesOptions = response.data.cities
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchCity()
          }
          this.intentos++
        })
    },
    fetchEspecialidades () {
      axios.get('/especialidades/fetch').then(response => {
        this.especialidadesOptions = response.data.especialidades
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchEspecialidades()
          }
          this.intentos++
        })
    },
    fetchOptionsClinicas () {
      axios.get('/clinicas').then(response => {
        this.clinicaOptions = response.data.clinicas
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchOptionsClinicas()
          }
          this.intentos++
        })
    },
    fetchCourts () {
      axios.get('/courts/fetch').then(response => {
        this.courtsOptions = response.data.courts
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchCourts()
          }
          this.intentos++
        })
    },
    fetchRisks () {
      axios.get('/risks/fetch').then(response => {
        this.risksOptions = response.data.risks
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchRisks()
          }
          this.intentos++
        })
    },
    fetchTypeProcess () {
      axios.get('/typeProcess/fetch').then(response => {
        this.typeProcessOptions = response.data.type_process
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchTypeProcess()
          }
          this.intentos++
        })
    },
    fetchAseguradoras () {
      axios.get('/aseguradoras/fetch').then(response => {
        this.aseguradorasOptions = response.data.aseguradoras
        this.intentos = 0
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchAseguradoras()
          }
          this.intentos++
        })
    },
    getTypeNotifications () {
      axios.get('/type_notifications/fetchTypeNotifications').then(response => {
        this.typeNotificationsOptions = response.data.type_notifications
        if (this.typeNotificationsOptions[0] !== undefined) {
          this.intentos = 0
          this.agenda.agen_type_not_id = this.typeNotificationsOptions[0].value
          this.errores = {}
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.getTypeNotifications()
          }
          this.intentos++
        })
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetch').then(response => {
        this.intentos = 0
        this.abogadoOptions = response.data.professionals
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchOptionsAbogados()
          }
          this.intentos++
        })
    },
    getEstadosProceso () {
      axios.get('/statusProcess/fetch').then(response => {
        this.statusProcessOptions = response.data.status_process
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          this.getEstadosProceso()
        })
    },
    cancelarEdicionProceso () {
      this.textoEditarProceso = 'Editar Proceso'
      this.editando = false
    },
    editarProceso () {
      // this.$router.push({ path: `/process/process-edit/` + this.prore_id })
      if (this.editando) {
        this.guardarProceso()
        this.estadoBotonActualizarProceso = 'disabled'
        this.textoEditarProceso = 'Actualizando Proceso...'
      } else {
        this.textoEditarProceso = 'Actualizar Proceso'
        this.editando = true
      }
    },
    guardarProceso () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.process.prore_user_id = this.userLogged.usr_id
      }
      const toke = localStorage.getItem('access_token')
      axios.post('/process/updateInfoProceso/' + this.prore_id, this.process, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        this.textoEditarProceso = 'Editar Proceso'
        this.estadoBotonActualizarProceso = ''
        if (res.data.status_code === 200) {
          this.process = res.data.process[0]
          this.textoEditarProceso = 'Editar Proceso'
          this.editando = false
          Vue.swal('Proceso actualizado correctamente')
        } else {
          this.textoEditarProceso = 'Guardar Proceso'
          Vue.swal('Error tratando de actualizar proceso. ' + res.data.message)
        }
      })
    },
    agregarLinkProceeding () {
      if (this.nuevoLinkProceeding.link_name === null || this.nuevoLinkProceeding.link_url === null) {
        Vue.swal('Por favor ingrese información del link')
        return false
      } else {
        this.linksProceeding.push({ link_name: this.nuevoLinkProceeding.link_name, link_url: this.nuevoLinkProceeding.link_url })
        this.limpiarNuevoLinkProceeding()
      }
    },
    getProcess () {
      if (this.prore_id != null) {
        axios.get('/process/' + this.prore_id).then(res => {
          this.process = res.data.process[0]
          this.implicateds = this.process.implicateds
          this.links = this.process.links
          this.proceedings = this.process.proceedings
          this.tableLinkKey++
        })
          .catch(this.errored = true)
          .finally(setTimeout(() => {
            this.loading = false
          }, 3500))
      }
    },
    guardarActuacion (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.checkFormActuacion()) {
        this.proceeding.proce_prore_id = this.prore_id
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando...'
        const token = localStorage.getItem('access_token')
        if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
          this.proceeding.proce_user_id = this.userLogged.usr_id
        }
        if (this.proceeding.proce_id != null) {
          axios.post('/proceedings/update/' + this.proceeding.proce_id, { formulario_proceeding: this.proceeding, links: this.linksProceeding }, { headers: { 'Authorization': token } }).then(res => {
            this.textoGuardarModal = 'Guardar'
            this.botonGuardarModal = ''
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              this.$bvModal.hide('modal-nueva-actuacion')
              this.limpiarModalActuacion()
              this.getProceedings()
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
          axios.post('/proceedings/store', { formulario_proceeding: this.proceeding, links: this.linksProceeding }, { headers: { 'Authorization': token } }).then(res => {
            this.textoGuardarModal = 'Guardar'
            this.botonGuardarModal = ''
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              this.$bvModal.hide('modal-nueva-actuacion')
              this.limpiarModalActuacion()
              this.getProceedings()
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
    getProceedings () {
      const token = localStorage.getItem('access_token')
      axios.get('/proceedings/getProceedingsProcessRequest/' + this.prore_id, { headers: { 'Authorization': token } }).then(response => {
        this.proceedingKey++
        this.intentos = 0
        this.proceedings = response.data.proceedings
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.getProceedings()
          }
          this.intentos++
        })
    },
    checkFormActuacion () {
      if (this.proceeding.proce_pro_id && this.proceeding.proce_sta_id && this.proceeding.proce_fecha_ingreso && this.proceeding.proce_fecha_actualizacion && this.proceeding.proce_descripcion) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.proceeding.proce_pro_id) {
        this.errors.push('El abogado es obligatorio.')
      }
      if (!this.proceeding.proce_sta_id) {
        this.errors.push('La etapa del proceso es obligatoria.')
      }
      if (!this.proceeding.proce_fecha_ingreso) {
        this.errors.push('La fecha de ingreso es obligatoria.')
      }
      if (!this.proceeding.proce_fecha_actualizacion) {
        this.errors.push('La fecha de actualización es obligatoria.')
      }
      if (!this.proceeding.proce_descripcion) {
        this.errors.push('La descripción es obligatoria.')
      }
    },
    agregarActuacion () {
      this.limpiarModalActuacion()
      this.$bvModal.show('modal-nueva-actuacion')
    },
    cancelado () {
      this.$bvModal.hide('modal-nueva-actuacion')
    },
    limpiarModalActuacion () {
      this.proceeding.proce_id = null
      this.proceeding.proce_prore_id = null
      this.proceeding.proce_pro_id = null
      this.proceeding.proce_sta_id = null
      this.proceeding.proce_fecha_ingreso = null
      this.proceeding.proce_fecha_actualizacion = null
      this.proceeding.proce_descripcion = null
      this.proceeding.proce_fecha_siguiente_audiencia = null
      this.proceeding.proce_hora_siguiente_audiencia = null
    },
    deleteLinkProceeding (proceedingLinkId) {
      this.estadoBotonEliminarLinkProceeding = 'disabled'
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este link?', {
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
          this.estadoBotonEliminarLinkProceeding = ''
          if (value) {
            this.linksProceeding.splice(proceedingLinkId, 1)
          }
        })
        .catch(err => {
          this.estadoBotonEliminarLinkProceeding = ''
          Vue.swal(err)
        })
    },
    limpiarNuevoLinkProceeding () {
      this.nuevoLinkProceeding.link_name = null
      this.nuevoLinkProceeding.link_url = null
    },
    editProceeding (llave) {
      this.proceeding.proce_id = this.proceedings[llave].proce_id
      this.proceeding.proce_pro_id = this.proceedings[llave].proce_pro_id
      this.proceeding.proce_sta_id = this.proceedings[llave].proce_sta_id
      this.proceeding.proce_fecha_ingreso = this.proceedings[llave].proce_fecha_ingreso
      this.proceeding.proce_fecha_actualizacion = this.proceedings[llave].proce_fecha_actualizacion
      this.proceeding.proce_descripcion = this.proceedings[llave].proce_descripcion
      this.proceeding.proce_fecha_siguiente_audiencia = this.proceedings[llave].proce_fecha_siguiente_audiencia
      this.proceeding.proce_hora_siguiente_audiencia = this.proceedings[llave].proce_hora_siguiente_audiencia
      this.linksProceeding = this.proceedings[llave].links
      this.$bvModal.show('modal-nueva-actuacion')
    },
    deleteProceeding (proceId) {
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar esta actuación?', {
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
            this.confirmDeleteProceeding(proceId)
          }
        })
        .catch(err => {
          Vue.swal(err)
        })
    },
    confirmDeleteProceeding (proceId) {
      const token = localStorage.getItem('access_token')
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.user_id = this.userLogged.usr_id
      }
      axios.post('/proceedings/delete/' + proceId + '/' + this.user_id, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal(res.data.message)
          this.getProceedings()
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          Vue.swal('Algo salio mal ' + err)
        })
    },
    defaultLink () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.user_id = this.userLogged.usr_id
      }
      return {
        link_name: null,
        link_url: null,
        link_prore_id: this.prore_id,
        link_user_id: this.user_id,
        editable: false
      }
    },
    agregarLink () {
      let obj = this.defaultLink()
      this.links.push(obj)
    },
    cancelEditLink (linkFor) {
      var linkIndex = this.links.indexOf(linkFor)
      var linkEdit = { ...this.links[linkIndex], ...{ editable: false } }
      this.links.splice(linkIndex, 1, linkEdit)
    },
    editLink (linkFor) {
      var linkIndex = this.links.indexOf(linkFor)
      var linkEdit = { ...this.links[linkIndex], ...{ editable: true } }
      this.links.splice(linkIndex, 1, linkEdit)
    },
    submitLink (linkFor) {
      if (this.checkFormLink(linkFor)) {
        linkFor.editable = false
        const token = localStorage.getItem('access_token')
        if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
          this.user_id = this.userLogged.usr_id
        }
        if (linkFor.link_id != null) {
          axios.post('/links/update/' + linkFor.link_id + '/' + this.user_id, linkFor, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              Vue.swal('Algo salio mal ' + err)
            })
        } else {
          axios.post('/links/store', linkFor, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
            if (res.data.status_code === 200) {
              Vue.swal(res.data.message)
              var linkIndex = this.links.indexOf(linkFor)
              var linkEdit = { ...this.links[linkIndex], ...{ editable: false, link_id: res.data.link_id } }
              this.links.splice(linkIndex, 1, linkEdit)
            } else {
              Vue.swal(res.data.message)
            }
          })
            .catch((err) => {
              Vue.swal('Algo salio mal ' + err)
            })
        }
      } else {
        return false
      }
    },
    removeLink (linkFor) {
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este link?', {
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
            this.confirmacionEliminacionLink(linkFor)
          }
        })
        .catch(err => {
          this.estadoBotonEliminarLinkProceeding = ''
          Vue.swal(err)
        })
    },
    confirmacionEliminacionLink (linkFor) {
      const token = localStorage.getItem('access_token')
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        this.user_id = this.userLogged.usr_id
      }
      if (linkFor.link_id != null) {
        axios.post('/links/delete/' + linkFor.link_id + '/' + this.user_id, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
          if (res.data.status_code === 200) {
            var linkIndex = this.links.indexOf(linkFor)
            this.links.splice(linkIndex, 1)
            Vue.swal(res.data.message)
          } else {
            Vue.swal(res.data.message)
          }
        })
          .catch((err) => {
            Vue.swal('Algo salio mal ' + err)
          })
      } else {
        var linkIndex = this.links.indexOf(linkFor)
        this.links.splice(linkIndex, 1)
      }
    },
    getImplicateds () {
      const token = localStorage.getItem('access_token')
      axios.get('/implicateds/get-implicateds-process/' + this.prore_id, { headers: { 'Authorization': token } }).then(response => {
        this.implicatedKey++
        this.intentos = 0
        this.implicateds = response.data.implicateds
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.getImplicateds()
          }
          this.intentos++
        })
    },
    agregarImplicated () {
      this.limpiarModalImplicated()
      this.$bvModal.show('modal-nuevo-implicated')
    },
    limpiarModalImplicated () {
      this.nuevoImplicated.imp_id = null
      this.nuevoImplicated.imp_tipo_identificacion = ''
      this.nuevoImplicated.imp_identificacion = ''
      this.nuevoImplicated.imp_nombres = ''
      this.nuevoImplicated.imp_direccion = ''
      this.nuevoImplicated.imp_apellidos = ''
      this.nuevoImplicated.imp_telefonos = ''
      this.nuevoImplicated.imp_emails = ''
      this.nuevoImplicated.imp_profile_id = ''
    },
    guardarImplicated () {
      if (this.checkFormImplicated()) {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando...'
        if (this.nuevoImplicated.imp_id != null) {
          this.ejecutarActualizacionImplicated()
        } else {
          this.ejecutarCreacionImplicated()
        }
      } else {
        return false
      }
    },
    ejecutarCreacionImplicated () {
      const token = localStorage.getItem('access_token')
      axios.post('/implicateds/store', this.nuevoImplicated, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if (res.data.status_code === 200) {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          this.getImplicateds()
          this.$bvModal.hide('modal-nuevo-implicated')
          this.limpiarModalImplicated()
          Vue.swal(res.data.message)
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Algo salio mal ' + err)
        })
    },
    ejecutarActualizacionImplicated () {
      const token = localStorage.getItem('access_token')
      axios.post('/implicateds/update/' + this.nuevoImplicated.imp_id + '/' + this.obtenerIdUsuario(), this.nuevoImplicated, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if (res.data.status_code === 200) {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          this.$bvModal.hide('modal-nuevo-implicated')
          this.getImplicateds()
          this.limpiarModalImplicated()
          Vue.swal(res.data.message)
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Algo salio mal ' + err)
        })
    },
    checkFormImplicated () {
      if (this.nuevoImplicated.imp_nombres && this.nuevoImplicated.imp_profile_id) {
        this.errors = []
        return true
      }
      this.errors = []
      if (!this.proceeding.proce_pro_id) {
        this.errors.push('El nombre es obligatorio.')
      }
      if (!this.proceeding.proce_sta_id) {
        this.errors.push('El apellido es obligatori.')
      }
      if (!this.proceeding.proce_fecha_ingreso) {
        this.errors.push('El perfil es obligatori.')
      }
    },
    checkFormLink (linkFor) {
      if (linkFor.link_name && linkFor.link_url) {
        return true
      } else {
        Vue.swal('Por favor ingrese el nombre y la url del link')
        return false
      }
    },
    fetchProfiles () {
      // solo trae los perfiles que no tengan que ver con la plataforma
      axios.get('/profiles/fetchExterns').then(response => {
        this.profilesOptions = response.data.profiles
        this.errores = {}
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos !== 2) {
            this.fetchProfiles()
          }
          this.intentos++
        })
    },
    editImplicated (implicatedIndex) {
      this.nuevoImplicated.imp_id = this.implicateds[implicatedIndex].imp_id
      this.nuevoImplicated.imp_tipo_identificacion = this.implicateds[implicatedIndex].imp_tipo_identificacion
      this.nuevoImplicated.imp_identificacion = this.implicateds[implicatedIndex].imp_identificacion
      this.nuevoImplicated.imp_nombres = this.implicateds[implicatedIndex].imp_nombres
      this.nuevoImplicated.imp_apellidos = this.implicateds[implicatedIndex].imp_apellidos
      this.nuevoImplicated.imp_direccion = this.implicateds[implicatedIndex].imp_direccion
      this.nuevoImplicated.imp_telefonos = this.implicateds[implicatedIndex].imp_telefonos
      this.nuevoImplicated.imp_emails = this.implicateds[implicatedIndex].imp_emails
      this.nuevoImplicated.imp_profile_id = this.implicateds[implicatedIndex].imp_profile_id
      this.nuevoImplicated.imp_rango_edad = this.implicateds[implicatedIndex].imp_rango_edad
      this.nuevoImplicated.imp_genero_id = this.implicateds[implicatedIndex].imp_genero_id
      this.$bvModal.show('modal-nuevo-implicated')
    },
    deleteImplicated (implicated) {
      this.$bvModal.msgBoxConfirm('¿Estás seguro de eliminar este involucrado?', {
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
            this.confirmacionEliminacionImplicated(implicated)
          }
        })
        .catch(err => {
          this.estadoBotonEliminarLinkProceeding = ''
          Vue.swal(err)
        })
    },
    confirmacionEliminacionImplicated (implicated) {
      const token = localStorage.getItem('access_token')
      axios.post('/implicateds/delete/' + implicated.imp_id + '/' + this.obtenerIdUsuario(), { headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if (res.data.status_code === 200) {
          this.getImplicateds()
          Vue.swal(res.data.message)
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          Vue.swal('Algo salio mal ' + err)
        })
    },
    obtenerIdUsuario () {
      var userId = null
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        userId = this.userLogged.usr_id
      }
      return userId
    },
    generoInvolucrado (generoId) {
      if (generoId === 1) {
        return 'Femenino'
      } else if (generoId === 2) {
        return 'Masculino'
      } else {
        return 'Sin asignar'
      }
    },
    guardarJuzgado (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      if (this.nuevo_court.name === '' || this.nuevo_court.name === null || this.nuevo_court.telefono === '' || this.nuevo_court.telefono === null) {
        Vue.swal('Por favor complete los datos.')
      } else {
        this.botonGuardarModal = 'disabled'
        this.textoGuardarModal = 'Guardando'
        this.handleSubmit()
      }
    },
    handleSubmit () {
      const toke = localStorage.getItem('access_token')
      axios.post('/courts/store', this.nuevo_court, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-crear-juzagado')
        })
        if (res.data.status_code === 200) {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          this.nuevo_court.name = ''
          this.nuevo_court.telefono = ''
          this.nuevo_court.email = ''
          this.process.prore_court_id = res.data.court_id
          Vue.swal('Juzgado agregado correctamente')
          this.fetchCourts()
        } else {
          this.botonGuardarModal = ''
          this.textoGuardarModal = 'Guardar'
          Vue.swal('Datos no validos')
        }
      })
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
