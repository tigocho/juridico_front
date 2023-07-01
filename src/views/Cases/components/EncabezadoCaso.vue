<template>
  <b-container class="px-0">
    <span class="text-dark text-underline">Radicado interno:</span><span> {{ casoId }}</span> | <span class="text-dark text-underline">Solicitante:</span><span> {{ solicitante }}</span> | <span class="text-dark text-underline">Fecha y hora de apertura:</span><span> {{ fechaHora }}</span>
  </b-container>
</template>
<script>
export default ({
  name: 'EncabezadoCaso',
  props: {
    casoId: String,
    solicitante: String,
    fechaHora: String
  },
  data () {
    return {
    }
  }
})
</script>
