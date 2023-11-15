<template>
  <b-container fluid>
    <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
      <template v-slot:body>
        <h4>Etapas</h4>
      </template>
    </iq-card>
  </b-container>
</template>
<script>
export default {
  name: 'EtapasTutela',
  props: {
    tutela: Object
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
