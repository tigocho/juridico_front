<template>
  <b-container fluid>
    <b-row>
      <b-col md="3">
        <!--<iq-card class="calender-small">
          <template v-slot:body>
            <flat-pickr :config="config" value="" class="d-none"/>
          </template>
        </iq-card>-->
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Programa de hoy</h4>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 today-schedule">
              <li class="d-flex" v-for='event in events' :key='event.id'>
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-primary" /></div>
                <div class="schedule-text"> <span>{{ event.title }}</span>
                  <span> {{ event.start_date }} </span>
                </div>
              </li>
              <!--<li class="d-flex">
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-success" /></div>
                <div class="schedule-text"> <span>Audiencia en el juzgado administrativo de Armenia</span>
                  <span>14:00 to 16:00</span></div>
              </li>-->
            </ul>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title ">Clasificación</h4>
          </template>
          <template v-slot:headerAction>
            <a><i class="fa fa-plus  mr-0" aria-hidden="true" /></a>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 job-classification">
              <li class=""><i class="ri-check-line bg-danger" />Reuniones</li>
              <li class=""><i class="ri-check-line bg-success" />Audiencias</li>
              <li class=""><i class="ri-check-line bg-warning" />Notificación de sentencias</li>
            </ul>
          </template>
        </iq-card>
      </b-col>
      <b-col md="9">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Reservar una cita</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#" class="btn btn-primary"><i class="ri-add-line mr-2"></i>Reservar una cita</a>
          </template>
          <template v-slot:body>
            <FullCalendar lang="es" :calendarEvents="events" />
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Agregar audiencia"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Nombre de la audiencia"
          label-for="name-input"
        >
          <b-form-input
            id="name-input"
            v-model="formData.aud_name"
            placeholder="Audiencia de cargos"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-select v-model="formData.aud_prore_id" :options="processOpenedOptions" id="selectuserrole" >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>Seleccione un proceso</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
        <b-form-group>
          <b-form-select v-model="formData.aud_pro_id" :options="abogadoOptions" @search="abogadoOptions" id="selectuserrole" >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>Seleccione un profesional</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
        <b-form-group label="Fecha de Inicio" label-for="agen_start_date">
          <b-form-input id="exampleInputdate" v-model="formData.agen_start_date" type="date"></b-form-input>
        </b-form-group>
        <b-form-group label="Fecha Final" label-for="agen_end_date">
          <b-form-input id="exampleInputdate" v-model="formData.agen_end_date" type="date"></b-form-input>
        </b-form-group>
        <b-form-group label="Hora de Audiencia" label-for="sch_start_hour">
          <b-form-input id="sch_start_hour" v-model="formData.sch_start_hour" type="time"></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
export default {
  name: 'GoogleCalendar',
  components: { },
  data () {
    return {
      config: {
        dateFormat: 'Y-m-d',
        inline: true
      },
      // select: this.handleSelect,
      events: [],
      processOpenedOptions: [],
      abogadoOptions: [],
      formData: {
        aud_name: '',
        aud_prore_id: '',
        aud_pro_id: '',
        agen_start_date: '',
        agen_end_date: '',
        sch_start_hour: ''
      },
      events2: [
        {
          title: 'All Day Event',
          start: '2021-05-07',
          color: '#fc9919'
        },
        {
          title: 'Long Event',
          start: '2021-05-20',
          end: '2021-05-25',
          color: '#ffc107' // override!
        }
      ]
    }
  },
  mounted () {
    xray.index()
    this.getAgendas()
    this.fetchOptionsAbogados()
    this.fetchProcessOpened()
  },
  computed: {
  },
  methods: {
    getAgendas () {
      axios.get('/agenda').then(response => {
        this.events = Object.keys(response.data.audiencias).map((key) => {
          return response.data.audiencias[key]
        })
      })
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit () {
      const toke = localStorage.getItem('access_token')
      axios.post('/audience/store', this.formData, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
        if (res.data.status_code === 200) {
          // this.audience.name = ''
          // this.audience.telefono = ''
          // this.audience.email = ''
          Vue.swal('Audiencia creada correctamente')
          this.getAgendas()
          this.formData.aud_name = ''
          this.formData.aud_prore_id = ''
          this.formData.aud_pro_id = ''
          this.formData.agen_start_date = ''
          this.formData.agen_end_date = ''
          this.formData.sch_start_hour = ''
        } else {
          Vue.swal('Datos no validos')
        }
      })
    },
    fetchProcessOpened () {
      axios.get('/process/fetchProcessOpened').then(response => {
        this.processOpenedOptions = response.data.process
      })
    },
    fetchOptionsAbogados () {
      axios.get('/professionals/fetch').then(response => {
        this.abogadoOptions = response.data.professionals
      })
    }
  }
}
</script>
