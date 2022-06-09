<template>
  <iq-card>
    <FormCase
      :case_id="cases.case_id"
      :case_title="cases.case_title"
      :case_description="cases.case_title"
      :onEdit="false"
      :reloadFunciont="null"
    />
  </iq-card>
</template>
<script>
import { xray } from '../../config/pluginInit'
import FormCase from '../Cases/components/FormCase.vue'
export default {
  name: 'AddCase',
  components: {
    FormCase
  },
  data () {
    return {
      cases: {
        case_id: null,
        case_title: '',
        case_description: ''
      }
    }
  },
  mounted () {
    xray.index()
  }
}
</script>
