<template>
  <b-container fluid>
    <div>
      <b-modal id="modal-lg" size="lg" title="Agendar Audiencia" @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <input type="hidden" name="hide" v-model="audiencia.aud_prore_id">
          <b-form-group
            label="Nombre"
            label-for="name-input"
            invalid-feedback="El nombre es obligatorio"
          >
            <b-form-input
              id="name-input"
              v-model="audiencia.aud_name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Asignar Abogada/o:" label-for="agen_pro_id">
            <b-form-select plain v-model="audiencia.aud_pro_id" :options="abogadoOptions" @search="fetchOptionsAbogados" id="selectuserrole">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>Seleccione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group label="Fecha de Inicio" label-for="agen_start_date">
            <b-form-input id="exampleInputdate" v-model="audiencia.agen_start_date" type="date" value="2019-12-18"></b-form-input>
          </b-form-group>
          <b-form-group label="Fecha Final" label-for="agen_end_date">
            <b-form-input id="exampleInputdate" v-model="audiencia.agen_end_date" type="date" value="2019-12-18"></b-form-input>
          </b-form-group>
          <b-form-group label="Hora de Audiencia" label-for="hora_udiencia">
            <b-form-input id="hora_udiencia" v-model="audiencia.sch_start_hour" type="time" value="13:45"></b-form-input>
          </b-form-group>
      </form>
      </b-modal>
    </div>
    <!-- User Interface controls -->
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Litigios/Solicitudes</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" @click="descargarInforme" :class="estadoBotonDescargarInforme">{{ botonDescargarInforme }}</b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col sm="4" md="3" class="my-1">
                <b-form-group
                  label="Por página"
                  label-for="per-page-select"
                  label-cols-sm="5"
                  label-cols-md="4"
                  label-cols-lg="5"
                  label-align-sm="left"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-form-select
                    id="per-page-select"
                    v-model="perPage"
                    :options="pageOptions"
                    size="sm"
                    class="w-50"
                  ></b-form-select>
                </b-form-group>
              </b-col>

              <b-col sm="8" md="9" class="my-1">
                <b-form-group
                  label="Buscar"
                  label-for="filter-input"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-input"
                      v-model="filter"
                      type="search"
                      placeholder="Escribe para buscar"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Main table element -->
            <b-table
              :items="process"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :filter-included-fields="filterOn"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              stacked="md"
              show-empty
              small
              @filtered="onFiltered"
            >
              <template #cell(name)="row">
                {{ row.value.first }} {{ row.value.last }}
              </template>

              <template #cell(actions)="row">
                <!--<b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
                  + Info
                </b-button>-->
                <b-button size="sm" @click="row.toggleDetails" class="mr-1">
                  {{ row.detailsShowing ? 'Ocultar' : 'Mostrar' }}
                </b-button>
                <b-button size="sm" v-b-modal.modal-lg variant="primary" @click="sendInfo(row.item.prore_id)">
                  Audiencia
                </b-button>
              </template>

              <template #row-details="row">
                <b-card>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="my-0" ><b><a href="#" @click="cargarLinksProcess(row.item.prore_id)"> Mostrar links:</a></b></b-card-text>
                    <div class="col-md-12 pl-0" v-if="links !== undefined && links.length > 0">
                      <b-card-text class="my-0" v-for="(link, index) in links" :key="index"><a v-bind:href="link.link_url" target="_blank">Link #{{ index }}: {{ link.link_name }}</a>
                      </b-card-text>
                    </div>
                    <div class="col-md-12 pl-0" v-else>
                      <span> No hay links en este proceso</span>
                    </div>
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="my-0"><b>Etapa procesal:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.estado_proceso }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.estado_proceso"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <hr>
                  <b>Abogado Asignado:</b>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1"><b>Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.pro_name_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.pro_name_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.pro_lastname_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.pro_lastname_first"
                        v-else
                        class="form-control col-md-1"
                      />
                    <b-card-text class="pl-3 my-0"><b>Identificación:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.pro_identificacion }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.pro_identificacion"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Correo electrónico:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.pro_email }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.pro_email"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <hr>
                  <b>Información del proceso:</b>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Ciudad:</b> {{ row.item.city_name }}</b-card-text>
                    <b-card-text class="pl-3 my-0"><b>Fecha de ingreso:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_fec_ingreso }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_fec_ingreso"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Clinica:</b></b-card-text>
                    <b-card-text class="px-1 my-0">{{ row.item.cli_name }}</b-card-text>
                    <b-card-text class="pl-3 my-0"><b>Fecha del siniestro:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_fec_sinister }}</b-card-text>
                      <input
                        type="date"
                        v-model="row.item.prore_fec_sinister"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Fecha aviso:</b> {{ row.item.prore_fec_sinies_aviso }}</b-card-text>
                    <b-card-text class="pl-3 my-0"><b>Fecha de recibo de notificación IPS:</b> {{ row.item.prore_fec_recibo_notify }}</b-card-text>
                    <b-card-text class="px-1 my-0"><b>Colaborador de IPS que recibe notificación:</b> {{ row.item.prore_colaborador_ips }}</b-card-text>
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Año de notificación:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_year_notify }}</b-card-text>
                      <input
                        type="date"
                        v-model="row.item.prore_year_notify"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Fecha notificación prejudicial:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_fec_noti_preju }}</b-card-text>
                      <input
                        type="date"
                        v-model="row.item.prore_fec_noti_preju"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Fecha notificación prejudicial:</b> {{ row.item.prore_fec_audi_conci_preju }}</b-card-text>
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Descripción del siniestro:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_sinies_description }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_sinies_description"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <hr>
                  <b>Información Juridica</b>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>ID Litigando:</b> {{ row.item.prore_litigando_id }}</b-card-text>
                    <b-card-text class="px-1 my-0"><b>Fecha de Ingreso a Juridico:</b> {{ row.item.prore_fec_ingreso_jur }}</b-card-text>
                  </b-row>
                  <hr>
                  <b>Información del Paciente</b>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Primer Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_pac_name_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_pac_name_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_pac_name_secdon }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_pac_name_secdon"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Primer Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_pac_lastname_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_pac_lastname_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_pac_lastname_second }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_pac_lastname_second"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Genero:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ formatearGenero(row.item.prore_pac_gender) }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_pac_gender"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Edad:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_pac_age }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_pac_age"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Telefono/Celular:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_phone }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_phone"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Correo Electrónico:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_email"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Especialidad:</b> {{ row.item.spe_name }}</b-card-text>
                  </b-row>
                  <hr>
                  <b>Información del Demandante</b>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Primer Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_name_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_name_secdon }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_name_secdon"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Primer Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_lastname_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_lastname_second }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_lastname_second"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                      <b-card-text class="px-1 my-0"><b>Telefono/Celular:</b></b-card-text>
                      <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_phone }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_phone"
                          v-else
                          class="form-control col-md-2"
                        />
                      <b-card-text class="pl-3 my-0"><b>Correo Electrónico:</b></b-card-text>
                      <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                        <input
                          type="text"
                          v-model="row.item.prore_applicant_email"
                          v-else
                          class="form-control col-md-2"
                        />
                  </b-row>
                  <hr>
                  <b>Información del Demandado</b>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Primer Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_defendant_name_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_name_second }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_defendant_name_second"
                        v-else
                        class="form-control col-md-2"
                      />

                    <b-card-text class="pl-3 my-0"><b>Primer Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_defendant_lastname_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_lastname_second }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_defendant_lastname_second"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Teléfono/Celular:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_defendant_phone }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_defendant_phone"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Correo Electrónico:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_applicant_email }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_applicant_email"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Tipo de proceso:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.typro_name }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.typro_name"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Juzgado:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.nombre_juzgado }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.nombre_juzgado"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Número radicado:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_num_radicado }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_num_radicado"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <hr>
                  <b>LLamado en Garantía</b>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Primer Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_name_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_warranty_name_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Nombre:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_name_second }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_warranty_name_second"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Primer Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_lastname_first }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_warranty_lastname_first"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Segundo Apellido:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_lastname_second }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_warranty_lastname_second"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-1">
                    <b-card-text class="px-1 my-0"><b>Teléfono/celular:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_phone }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_warranty_phone"
                        v-else
                        class="form-control col-md-2"
                      />
                    <b-card-text class="pl-3 my-0"><b>Correo electrónico:</b></b-card-text>
                    <b-card-text class="px-1 my-0" v-if="row.item.editable!=0">{{ row.item.prore_warranty_email }}</b-card-text>
                      <input
                        type="text"
                        v-model="row.item.prore_warranty_email"
                        v-else
                        class="form-control col-md-2"
                      />
                  </b-row>
                  <b-row class="col-md-12 pt-5">
                    <b-button class="mr-2" size="sm" @click="row.toggleDetails">Ocultar</b-button>
                    <b-button variant="primary" size="sm" @click="edit(row.item.prore_id)">Editar Proceso</b-button>
                  </b-row>
                </b-card>
              </template>
            </b-table>
            <b-row>
              <b-col sm="4" md="3" class="my-1 text-righ">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                ></b-pagination>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
          <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-container>
  </template>
<script>
import auth from '@/logic/auth'
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'
const FileDownload = require('js-file-download')

export default {
  data () {
    return {
      botonDescargarInforme: 'Descargar Informe',
      estadoBotonDescargarInforme: '',
      user_id: '',
      process: [],
      audiencia: {
        aud_name: '',
        aud_pro_id: '',
        agen_start_date: '',
        agen_end_date: '',
        sch_start_hour: ''
      },
      abogadoOptions: [],
      fields: [
        // { key: 'name', label: 'Person full name', sortable: true, sortDirection: 'desc' },
        // { key: 'age', label: 'Person age', sortable: true, class: 'text-center' },
        { key: 'prore_id', label: 'ID', sortable: true, sortDirection: 'desc', class: 'text-center' },
        { key: 'prore_litigando_id', label: 'ID Litigando', sortable: true, class: 'text-center' },
        { key: 'nombre_abogado', label: 'Abogado/a', sortable: true, class: 'text-left' },
        { key: 'cli_name', label: 'Clinica', sortable: true, class: 'text-left' },
        { key: 'prore_fec_ingreso', label: 'Fec Ingreso', sortable: true, class: 'text-center' },
        { key: 'prore_fec_sinister', label: 'Fec de Siniestro', sortable: true, class: 'text-center' },
        { key: 'estado_proceso', label: 'Estado del Proceso', sortable: true, class: 'text-left' },
        // {
        // key: 'isActive',
        // label: 'Is Active',
        // formatter: (value, key, item) => {
        // return value ? 'Yes' : 'No'
        // },
        // sortable: true,
        // sortByFormatted: true,
        // filterByFormatted: true
        // },
        { key: 'actions', label: 'Acciones', class: 'text-center' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: 'Muchas' }],
      sortBy: '',
      sortDesc: false,
      estado_elegido: 'todos',
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      links: {}
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted () {
    xray.index()
    this.getProcess()
    this.fetchOptionsAbogados()
    // Set the initial number of items
    this.totalRows = this.process.length
  },
  methods: {
    getProcess () {
      var user = JSON.parse(auth.getUserLogged())
      this.user_id = user.usr_id
      axios.get('/process/' + this.user_id).then(response => {
        this.process = response.data.process
      })
    },
    edit (item) {
      this.$router.push({ path: `/process/process-edit/${item}` })
    },
    handleOk (bvModalEvt) {
      bvModalEvt.preventDefault()
      if (this.audiencia.aud_name !== '' && this.audiencia.aud_pro_id !== '' &&
      this.audiencia.agen_start_date !== '' && this.audiencia.agen_end_date !== '' && this.audiencia.sch_start_hour !== '') {
        // Trigger submit handler
        this.handleSubmit()
      } else {
        Vue.swal('Por favor completa todo el formulario')
      }
    },
    handleSubmit () {
      const token = localStorage.getItem('access_token')
      axios.post('/audience/store', this.audiencia, { headers: { 'Authorization': token } }).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal('Audiencia agendada al proceso correctamente')
          this.$bvModal.hide('modal-lg')
          this.$router.push({ name: 'process.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetch').then(response => {
        this.abogadoOptions = response.data.professionals
      })
    },
    sendInfo (item) {
      this.audiencia.aud_prore_id = item
    },
    info (item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    formatearGenero (generoId) {
      if (generoId === '1') {
        return 'Masculino'
      } else {
        return 'Femenino'
      }
    },
    descargarInforme () {
      this.botonDescargarInforme = 'Descargando informe...'
      this.estadoBotonDescargarInforme = 'disabled'
      axios({
        url: '/process/exportReport',
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        this.botonDescargarInforme = 'Descargar informe'
        this.estadoBotonDescargarInforme = ''
        FileDownload(response.data, 'report-process.xlsx')
      })
        .catch((err) => {
          this.botonDescargarInforme = 'Descargar informe'
          this.estadoBotonDescargarInforme = ''
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    },
    cargarLinksProcess (processId) {
      axios.get('/links/obtenerLinksProceso/' + processId).then(response => {
        this.links = response.data.links
      })
        .catch((err) => {
          Vue.swal('Ups, ocurrió un error ' + err)
        })
    }
  }
}
</script>
