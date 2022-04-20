<template>
  <b-container fluid>
    <section>
      <b-row>
        <b-col lg="12">
          <iq-card body-class="p-0">
            <template v-slot:body>
              <div class="iq-edit-list-data">
                <b-tabs content-class="mt-3" justified>
                  <b-tab title="Información General" active>
                    <b-card>
                      <h4 class="card-title">ID - {{ caso.caso_id }}</h4>
                      <b-card-text >
                           <b-row>
                        <b-col><strong>Título: </strong> {{ caso.caso_titulo }}</b-col>
                        <b-col cols="5"><strong>Tiempo se Solución: </strong> {{ caso.caso_fecha_estimada_solucion }} </b-col>
                        </b-row>
                      </b-card-text>
                      <b-card-text>
                           <b-row>
                        <b-col><strong>Solicitante: </strong> {{ caso.caso_titulo }}</b-col>
                         <b-col cols="5"><strong>Abogado: </strong> {{ caso.abogado }} </b-col>
                          </b-row>
                      </b-card-text>
                      <b-card-text>
                        <strong>Clínica: </strong> {{ caso.caso_titulo }}
                      </b-card-text>
                      <b-card-text>
                        <strong>Medio de Solicitud: </strong>
                        {{ caso.caso_titulo }}
                      </b-card-text>
                      <b-card-text>
                        <strong>Archivo: </strong> {{ caso.caso_titulo }}
                      </b-card-text>
                      <b-card-text>
                        <strong>Descripción </strong>
                        <p>{{ caso.caso_descripcion }}</p>
                      </b-card-text>
                    </b-card>
                  </b-tab>
                  <b-tab title="Seguimiento"><p>I'm the second tab</p></b-tab>
                  <b-tab title="Historial"
                    ><p>I'm the tab with the very, very long title</p></b-tab
                  >
                </b-tabs>
              </div>
            </template>
          </iq-card>
        </b-col>
      </b-row>
    </section>
  </b-container>
</template>
<script>
import axios from 'axios'
export default {
  name: 'ShowCase',
  data () {
    return {
      caso: {},
      archivo: {}
    }
  },
  mounted () {
    this.getCase()
  },
  methods: {
    getCase () {
      axios
        .get('/show-caso/' + this.$route.params.caso_id)
        .then((res) => {
          console.log(res.data.caso[0])
          this.caso = res.data.caso[0]
        })
        .catch((err) => {
          this.errores = err
        })
    }
  }
}
</script>
