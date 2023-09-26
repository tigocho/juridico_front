<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <b-row>
          <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
            <template v-slot:headerTitle>
              <h4 class="card-title">Cmi Jurídico</h4>
            </template>
            <template v-slot:body>
              <iframe
                title="Report Section"
                width="1100"
                height="700"
                src="https://app.powerbi.com/view?r=eyJrIjoiMjMyNmYwM2EtOWI2OC00MmJkLWFjOTgtMjVmN2E1Mjg5MTcxIiwidCI6ImQ5NjQyNDE1LWRmYjctNGMwZi1iNzY5LTg0MjgwMWI4NTViNyJ9"
                frameborder="0"
                allowFullScreen="true"
              ></iframe>
            </template>
          </iq-card>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
}
</script>
