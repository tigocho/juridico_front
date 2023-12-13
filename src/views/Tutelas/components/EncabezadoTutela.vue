<template>
  <b-container fluid>
      <b-row>
        <b-col>
          <iq-card class-name="py-2 px-4" >
            <template v-slot:headerTitle>
              <span class="text-dark text-underline">Radicado interno:</span><span> {{ tutela.tut_radicado }}</span> | <span class="text-dark text-underline">Solicitante:</span><span> {{ tutela.usuario_solicitante.usr_name_first }} {{ tutela.usuario_solicitante.usr_lastname_first }}</span> | <span class="text-dark text-underline">Accionante:</span><span> {{ tutela.accionante.usr_name_first }} {{ tutela.accionante.usr_lastname_first }}</span> | <span class="text-dark text-underline">Fecha y hora de apertura:</span><span> {{ tutela.tut_fecha_solicitud }}</span>
            </template>
            <template v-slot:headerAction>
              <b-button variant="primary" @click="editarTutela" :class="estadoBotonActualizarProceso">{{ botonEditarTutela }}
              </b-button>
            </template>
          </iq-card>
        </b-col>
      </b-row>
  </b-container>
</template>
<script>
export default ({
  name: 'EncabezadoTutela',
  props: {
    tutela: Object
  },
  data () {
    return {
      botonEditarTutela: 'Editar Tutela',
      estadoBotonActualizarProceso: null
    }
  },
  methods: {
    editarTutela () {
      this.$emit('emitirEditarTutela', this.tutela)
    }
  }
})
</script>
