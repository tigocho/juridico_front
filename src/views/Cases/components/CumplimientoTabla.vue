<template>
  <b-container fluid>
     <b-table
            :items="datosCumplimiento"
            ></b-table>
    </b-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TablaCumplimiento',
  data () {
    return {
      datosCumplimiento: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      axios.get('/casos-cumplimiento/clinica/2022-03-02/2022-07-01').then((res) => {
        if (res.status === 200) {
          this.datosCumplimiento = res.data.tabla_cumplimiento
        }
      })
    }
  }
}
</script>
