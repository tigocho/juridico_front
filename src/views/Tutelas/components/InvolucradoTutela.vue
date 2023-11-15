<template>
  <b-container fluid>
    <iq-card class-name="iq-card-block iq-card-stretch iq-card-height iq-user-profile-block">
      <template v-slot:body>
        <div class="user-details-block">
          <div class="user-profile text-center">
            <img :src="detectarFoto(parseInt(usuario.usr_gender))" alt="profile-img" class="avatar-80 img-fluid">
          </div>
          <div class="text-center mt-3">
            <h4><b> {{ usuario.usr_name_first }} {{ usuario.usr_lastname_first }}</b></h4>
            <h5>{{ tipoUsuario }}</h5>
            <b-card-text class="my-0"><strong>Tipo documento: </strong> {{ tipoIdentification(parseInt(usuario.usr_identification_type)) ? tipoIdentification(parseInt(usuario.usr_identification_type)) : 'Sin dato' }} </b-card-text>
            <b-card-text class="pr-3 my-0"><strong>Documento: </strong> {{ usuario.usr_identification ? usuario.usr_identification : 'Sin dato' }}</b-card-text>
          </div>
        </div>
      </template>
    </iq-card>
  </b-container>
</template>
<script>
export default {
  name: 'InvolucradoTutela',
  props: {
    usuario: Object,
    tipoUsuario: String
  },
  data () {
    return {
    }
  },
  methods: {
    tipoIdentification (tipoIdentificacionId) {
      if (tipoIdentificacionId === 1) {
        return 'C.C'
      } else if (tipoIdentificacionId === 2) {
        return 'T.I'
      } else if (tipoIdentificacionId === 3) {
        return 'C.C'
      } else if (tipoIdentificacionId === 4) {
        return 'NIT'
      }
    },
    detectarFoto (genero) {
      console.log(genero)
      if (genero === 1) {
        return require('../../../assets/images/user/11.png')
      } else {
        return require('../../../assets/images/user/09.png')
      }
    }
  }
}
</script>
