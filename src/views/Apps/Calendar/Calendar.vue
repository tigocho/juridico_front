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
            <h4 class="card-title">Crear audiencia</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#" class="btn btn-primary" @click="newEvent"><i class="ri-add-line mr-2" ></i>Crear audiencia</a>
          </template>
          <Fullcalendar
              :plugins="calendarPlugins"
              :header="{
                  center: 'title',
                  right: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek',
                  left: 'prev today next'
              }"
              :buttonText="{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana',
                  day: 'Día',
                  list: 'Lista'
              }"
              :weekends="false"
              :selectable="true"
              :editable="true"
              :events="events"
              @select="handleSelect"
              @eventClick="handleEventClick"
              @eventResize="updateEvent"
              @eventDrop="updateEvent"
              @eventRender="renderEvent"
          />
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      id="modal-audience"
      ref="modal"
      v-bind:title="title_modal_text"
      @ok="handleOk"
      @hidden="cancelado"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <input type="hidden" name="hide" v-model="formData.sch_id">
        <b-form-group
          label="Nombre de la audiencia"
          label-for="name-input"
        >
          <b-form-input
            id="name-input"
            v-model="formData.agen_name"
            placeholder="Audiencia de cargos"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="ID del Proceso">
          <b-form-select v-model="formData.agen_prore_id" :options="processOpenedOptions" id="selectuserrole" >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>Seleccione un proceso</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
        <b-form-group label="Abogado/a">
          <b-form-select v-model="formData.agen_pro_id" :options="abogadoOptions" @search="abogadoOptions" id="selectuserrole" >
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
        <b-form-group label="Hora de finalización" label-for="sch_end_hour">
          <b-form-input id="sch_start_hour" v-model="formData.sch_end_hour" type="time"></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </b-container>
  <!--<modals-container />-->
</template>
<script>
import Fullcalendar from '@fullcalendar/vue'
import DayGridPlugin from '@fullcalendar/daygrid'
import TimeGridPlugin from '@fullcalendar/timegrid'
import InteractionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'
import { xray } from '../../../config/pluginInit'
import axios from 'axios'
import Vue from 'vue'
axios.defaults.baseURL = 'http://181.129.171.26:9898/juridico_api/public/api'
export default {
  data: () => ({
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ],
    config: {
      dateFormat: 'Y-m-d',
      inline: true
    },
    events: [],
    title_modal_text: 'Crear audiencia',
    processOpenedOptions: [],
    abogadoOptions: [],
    formData: {
      sch_id: '',
      agen_name: '',
      agen_prore_id: '',
      agen_pro_id: '',
      agen_start_date: '',
      agen_end_date: '',
      sch_start_hour: '',
      sch_end_hour: ''
    }
  }),
  mounted () {
    xray.index()
    this.getAgendas()
    this.fetchOptionsAbogados()
    this.fetchProcessOpened()
  },
  components: { Fullcalendar },
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
      if (this.formData.sch_id > 0) {
        axios.post('/agenda/updateSchedule/' + this.formData.sch_id, this.formData, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
          // Hide the modal manually
          this.$nextTick(() => {
            this.$bvModal.hide('modal-audience')
          })
          if (res.data.status_code === 200) {
            Vue.swal('Audiencia modificada correctamente')
            this.getAgendas()
            this.limpiarModal()
          } else {
            Vue.swal('Datos no validos')
          }
        })
      } else {
        axios.post('/audience/store', this.formData, { headers: { 'Authorization': `Bearer ${toke}` } }).then(res => {
          // Hide the modal manually
          this.$nextTick(() => {
            this.$bvModal.hide('modal-audience')
          })
          if (res.data.status_code === 200) {
            Vue.swal('Audiencia creada correctamente')
            this.getAgendas()
            this.limpiarModal()
          } else {
            Vue.swal('Datos no validos')
          }
        })
      }
    },
    cancelado () {
      this.limpiarModal()
    },
    limpiarModal () {
      this.formData.agen_name = ''
      this.formData.agen_prore_id = ''
      this.formData.agen_pro_id = ''
      this.formData.agen_start_date = ''
      this.formData.agen_end_date = ''
      this.formData.sch_start_hour = ''
      this.formData.sch_id = ''
      this.formData.sch_end_hour = ''
      this.title_modal_text = 'Crear audiencia'
    },
    newEvent () {
      this.limpiarModal()
      this.$bvModal.show('modal-audience')
    },
    renderEvent (arg) {
    },
    updateEvent (arg) {
      this.formData.sch_id = arg.event.id
      var hourStart = this.formatHour(arg.event.start)
      var hourEnd = this.formatHour(arg.event.end)
      this.formData.agen_name = arg.event.title
      this.formData.agen_pro_id = arg.event.extendedProps.agen_pro_id
      this.formData.agen_prore_id = arg.event.extendedProps.agen_prore_id
      this.formData.agen_start_date = this.formatDate(arg.event.start)
      this.formData.agen_end_date = this.formatDate(arg.event.end)
      this.formData.sch_start_hour = hourStart
      this.formData.sch_end_hour = hourEnd
      this.handleSubmit()
    },
    handleSelect (arg) {
      var hourStart = this.formatHour(arg.start)
      var hourEnd = this.formatHour(arg.end)
      this.formData.agen_start_date = this.formatDate(arg.start)
      this.formData.agen_end_date = this.formatDate(arg.end)
      this.formData.sch_start_hour = hourStart
      this.formData.sch_end_hour = hourEnd
      this.$bvModal.show('modal-audience')
    },
    handleEventClick (arg) {
      this.formData.sch_id = arg.event.id
      this.title_modal_text = 'Editar audiencia #' + this.formData.sch_id
      this.formData.agen_name = arg.event.title
      this.formData.agen_prore_id = arg.event.extendedProps.agen_prore_id
      this.formData.agen_pro_id = arg.event.extendedProps.agen_pro_id
      this.formData.agen_start_date = arg.event.extendedProps.agen_start_date
      this.formData.agen_end_date = arg.event.extendedProps.agen_end_date
      this.formData.sch_start_hour = arg.event.extendedProps.hour
      this.$bvModal.show('modal-audience')
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
    },
    formatDate (date) {
      if (date !== null) {
        // YYYY-MM-DD
        var options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        let string = date.toLocaleDateString('en-US', options).split('/')
        // create array of values returned by `.toLocaleDateString()`,
        // delimited by `/`
        // `y` : year
        var y = string.splice(-1)[0]
        // set `y` as item at index `0` of `d`
        string.splice(0, 0, y)
        // join items within `d` with dash character `"-"`
        var dateFinal = string.join('-')
        return dateFinal
      }
      return null
    },
    formatHour (dateTime) {
      if (dateTime !== null) {
        return this.addZero(dateTime.getHours()) + ':' + this.addZero(dateTime.getMinutes())
      }
      return null
    },
    addZero (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }
  }
}
</script>

<style lang='scss'>
  .fc-event, .fc-event:hover{
    color: #ffffff !important;
  }
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';
  @import '~@fullcalendar/timegrid/main.css';
  @import '~@fullcalendar/list/main.min.css';
</style>
