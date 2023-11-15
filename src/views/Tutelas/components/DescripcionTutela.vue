<template>
  <b-container fluid>
    <b-col sm="12">
      <b-row>
        <b-col lg="4">
          <involucrado-tutela
            :usuario="tutela.accionante"
            tipoUsuario="Accionante"
          >
          </involucrado-tutela>
        </b-col>
        <b-col lg="4">
          <involucrado-tutela
            :usuario="tutela.profesional.user"
            tipoUsuario="Abogado"
          >
          </involucrado-tutela>
        </b-col>
        <b-col lg="4">
          <involucrado-tutela
            :usuario="tutela.usuario_solicitante"
            tipoUsuario="Solicitante"
          >
          </involucrado-tutela>
        </b-col>
      </b-row>
    </b-col>
    <b-row>
      <b-col lg="3">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title"><strong>Detalles básicos</strong></h4>
          </template>
          <template v-slot:body>
            <ul class="patient-progress m-0 p-0">
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Radicación:</strong> {{ fechaLegibleUsuario(tutela.tut_fecha_radicacion) }}</h6>
                </div>
              </li>
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Solicitud:</strong> {{ fechaLegibleUsuario(tutela.tut_fecha_solicitud) }}</h6>
                </div>
              </li>
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Termino contestar:</strong> {{ tutela.tut_termino_contestar }} horas ({{ transformarDias(tutela.tut_termino_contestar) }} días)</h6>
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="6">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title"><strong>Información Tutela</strong></h4>
          </template>
          <template v-slot:headerAction>
            <div class="dropdown">
              <span class="dropdown-toggle text-primary" id="dropdownMenuButton4" data-toggle="dropdown">
                <strong>Estado:</strong> <span style="text-decoration:underline">{{ tutela.estado.est_nombre }}</span>
              </span>
            </div>
          </template>
          <template v-slot:body>
            <ul class="patient-progress m-0 p-0">
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Actividad:</strong> {{ tutela.actividad.act_nombre }}</h6>
                </div>
              </li>
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Tipo de tramite:</strong> {{ tutela.tipo_litigio.til_nombre }}</h6>
                </div>
              </li>
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Gestión:</strong> {{ tutela.tipo_gestion.tig_nombre }}</h6>
                </div>
              </li>
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Descripción:</strong> {{ tutela.tut_descripcion }}</h6>
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="3">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title"><strong>Detalles empresa</strong></h4>
          </template>
          <template v-slot:body>
            <ul class="patient-progress m-0 p-0">
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Solicitante:</strong> {{ tutela.clinica.cli_name }}</h6>
                </div>
              </li>
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Tipo de servicio:</strong> {{ tutela.servicio.serv_nombre }}</h6>
                </div>
              </li>
              <li class="d-flex mb-3 align-items-center">
                <div class="media-support-info">
                  <h6><strong>Medio de Solicitud:</strong> {{ tutela.medio_solicitud.med_sol_nombre }}</h6>
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
    </b-row>
  </b-container>
</template>
<script>
import InvolucradoTutela from './InvolucradoTutela'
import moment from 'moment'
moment.locale('es')
export default {
  name: 'DescripcionTutela',
  props: {
    tutela: Object
  },
  components: {
    InvolucradoTutela
  },
  data () {
    return {
    }
  },
  methods: {
    fechaLegibleUsuario (fecha) {
      return moment(fecha).format('dddd D [de] MMMM hh:mm A')
    },
    transformarDias (horas) {
      return horas / 8
    },
    tipoIdentification (tipoIdentificacionId) {
      if (tipoIdentificacionId === 1) {
        return 'C.C'
      } else if (tipoIdentificacionId === 2) {
        return 'T.I'
      } else if (tipoIdentificacionId === 3) {
        return 'C.C'
      } else if (tipoIdentificacionId === 4) {
        return 'NIT'
      }
    }
  }
}
</script>
