<template>
  <iq-card>
    <formulario-tutela>
    </formulario-tutela>
  </iq-card>
</template>
<script>
import { xray } from '../../config/pluginInit'
import FormularioTutela from './components/FormularioTutela.vue'
export default {
  name: 'AgregarTutela',
  components: {
    FormularioTutela
  },
  data () {
    return {
      cases: {}
    }
  },
  mounted () {
    xray.index()
  },
  methods: {
    cerrarModalCrearCliente () {
      this.$refs.modal.hide()
    }
  }
}
</script>
