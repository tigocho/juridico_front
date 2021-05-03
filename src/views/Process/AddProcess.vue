<template>
    <b-container fluid>
        <form-wizard @onComplete="onSubmit">
            <tab-content title="Información General" :selected="true">
                <b-container fluid>
                    <b-row>
                        <b-col md="12">
                            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                            <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                                <b-row>
                                    <b-col lg="12">
                                        <iq-card>
                                            <template v-slot:body>
                                                <div class="new-user-info">
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Fecha de Ingreso" label-for="prore_fec_ingreso">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_ingreso" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Clinica/IPS:" label-for="selectuserrole">
                                                            <b-form-select plain v-model="proc.prore_defendaant_clin" :options="roles" id="selectuserrole">
                                                                <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Año del Siniestro" label-for="exampleInputNumber1">
                                                            <b-form-input id="exampleInputNumber1" v-model="proc.prore_year_sinister" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Fecha del Siniestro" label-for="prore_fec_sinister">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_sinister" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Año de Notificación" label-for="exampleInputNumber1">
                                                            <b-form-input id="exampleInputNumber1" v-model="proc.prore_year_notify" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA DE NOTIFICACION PREJUDICIAL" label-for="prore_fec_noti_preju">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_noti_preju" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA DE LA AUDIENCIA DE CONCILIACIÓN PREJUDICIAL" label-for="prore_fec_audi_conci_preju">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_audi_conci_preju" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA AVISO DEL  SINIESTRO" label-for="prore_fec_sinies_aviso">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_sinies_aviso" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="DESCRIPCIÓN  DEL SINIESTRO" label-for="prore_sinies_description">
                                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.prore_sinies_description" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="FECHA DE RECIBIDO DE NOTIFICACION IPS" label-for="prore_fec_recibo_notify">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_recibo_notify" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="COLABORADOR DE IPS QUE RECIBE NOTIFICACION:" label-for="prore_fec_recibo_notify">
                                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Fecha de Inggreso a Juridico" label-for="prore_fec_ingreso_jur">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_ingreso_jur" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Fecha de Ingreso a Clínica" label-for="prore_fec_ingreso_cli">
                                                            <b-form-input id="exampleInputdate" v-model="proc.prore_fec_ingreso_cli" type="date" value="2019-12-18"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="CIUDAD:" label-for="selectuserrole">
                                                            <b-form-select plain v-model="proc.prore_pac_city_id" :options="city" id="selectuserrole">
                                                                <template v-slot:first>
                                                                    <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Nombre Paciente:" label-for="prore_pac_name_first">
                                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.prore_pac_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre Paciente:" label-for="prore_pac_name_secdon">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.prore_pac_name_second" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio Paciente:" label-for="prore_pac_lastname_first">
                                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.prore_pac_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio Paciente:" label-for="prore_pac_lastname_second">
                                                        <ValidationProvider name="Segundo Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.prore_pac_lastname_second" type="text" placeholder="Segundo Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="GENERO DEL PACIENTE:" label-for="usr_lastname_first">
                                                            <template v-for="(item,index) in state">
                                                            <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                                            </template>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="EDAD DEL PACIENTE" label-for="exampleInputNumber1">
                                                            <b-form-input v-model="proc.prore_pac_age" id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Especialidad:" label-for="selectuserrole">
                                                            <b-form-select plain v-model="proc.prore_prospe_id" :options="roles" id="selectuserrole">
                                                                <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione una especialidad</b-form-select-option>
                                                                </template>
                                                            </b-form-select>
                                                        </b-form-group>
                                                    </b-row>
                                                </div>
                                            </template>
                                        </iq-card>
                                    </b-col>
                                </b-row>
                            </form>
                            </ValidationObserver>
                        </b-col>
                    </b-row>
                </b-container>
            </tab-content>
            <tab-content title="Partes del Proceso">
                <b-container fluid>
                    <b-row>
                        <b-col md="12">
                            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                            <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                                <b-row>
                                    <b-col lg="12">
                                        <iq-card>
                                            <template v-slot:body>
                                                <h4 class="card-title">Información del Demandante:</h4>
                                                <div class="new-user-info">
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Primer Nombre:" label-for="usr_name_first">
                                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio:" label-for="usr_lastname_first">
                                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio:" label-for="usr_lastname_first">
                                                        <ValidationProvider name="Segundo Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_lastname_last" type="text" placeholder="Segundo Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                    </b-row>
                                                    <hr>
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Telefono/Celular:" label-for="uname">
                                                            <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_username" type="number" placeholder="301545656" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Correo Electronico:" label-for="uname">
                                                            <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                    </b-row>
                                                </div>
                                                <h4 class="card-title">Información del Demandado:</h4>
                                                <div class="new-user-info">
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Primer Nombre:" label-for="usr_name_first">
                                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio:" label-for="usr_lastname_first">
                                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio:" label-for="usr_lastname_first">
                                                        <ValidationProvider name="Segundo Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_lastname_last" type="text" placeholder="Segundo Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                    </b-row>
                                                    <hr>
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Telefono/Celular:" label-for="uname">
                                                            <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_username" type="number" placeholder="301545656" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Correo Electronico:" label-for="uname">
                                                            <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                    </b-row>
                                                </div>
                                                <h4 class="card-title">LLamado en Garantía:</h4>
                                                <div class="new-user-info">
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Primer Nombre:" label-for="usr_name_first">
                                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Primer Apelldio:" label-for="usr_lastname_first">
                                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Segundo Apelldio:" label-for="usr_lastname_first">
                                                        <ValidationProvider name="Segundo Apelldio" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_lastname_last" type="text" placeholder="Segundo Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                        </b-form-group>
                                                    </b-row>
                                                    <hr>
                                                    <b-row>
                                                        <b-form-group class="col-md-6" label="Telefono/Celular:" label-for="uname">
                                                            <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_username" type="number" placeholder="301545656" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Correo Electronico:" label-for="uname">
                                                            <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                    </b-row>
                                                </div>
                                            </template>
                                        </iq-card>
                                    </b-col>
                                </b-row>
                            </form>
                            </ValidationObserver>
                        </b-col>
                    </b-row>
                </b-container>
            </tab-content>
            <tab-content title="Proceso Judicial">
                <b-container fluid>
                    <b-row>
                        <b-col md="12">
                            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                            <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                                <b-row>
                                    <b-col lg="12">
                                        <iq-card>
                                        <template v-slot:body>
                                            <div class="new-user-info">
                                                <b-row>
                                                    <b-form-group class="col-md-6" label="Tipo de Proceso:" label-for="selectuserrole">
                                                        <b-form-select plain v-model="proc.usr_role_id" :options="roles" id="selectuserrole">
                                                            <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                            </template>
                                                        </b-form-select>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Juzgado:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Telefono/Celular Juzgado:" label-for="uname">
                                                        <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_username" type="number" placeholder="301545656" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                        <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                        </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Correo Electronico Juzgado:" label-for="uname">
                                                        <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Número de Radicado" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Objeto del Litigio:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <template>
                                                        <b-form-group class="col-md-6" label="Proceso Ejecutivo:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Ejecuntante:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Medida Cuatelar" label-for="exampleInputNumber1">
                                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Prestaciones/Capital/Interes/Honorarios:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                    </template>
                                                    <template>
                                                        <b-form-group class="col-md-6" label="Pretensiones Laborales:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Prestaciones Sociales:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Pretensiones por Vacaciones" label-for="exampleInputNumber1">
                                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Pretensiones por Indemnización:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Pago de Seguridad Social en Salud:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Salarios dejados de Percibir" label-for="exampleInputNumber1">
                                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                        </b-form-group>
                                                        <b-form-group class="col-md-6" label="Otros:" label-for="usr_name_first">
                                                            <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                                <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                    <div class="invalid-feedback">
                                                                        <span>{{ errors[0] }}</span>
                                                                    </div>
                                                            </ValidationProvider>
                                                        </b-form-group>
                                                    </template>
                                                    <b-form-group class="col-md-6" label="Val Lucro Cesante:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val daño Emergente:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Total Prejuicios Materiales" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Valor daño Moral:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Daño a la Vida ó Prejuicios Fisiologicos y Otros:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre" ></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Total Prejuicios Inmateriales Indicados en la Demanda" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Estimación del monto a pagar Prejuicios Inmateriales:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val que Cube la Poliza Prejuicios Inmateriales:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Cuenta de las Prentensiones" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Valor daño Moral:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Riesgo Nif:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Valor a Provisionar" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Aseguradora:" label-for="selectuserrole">
                                                        <b-form-select plain v-model="proc.usr_role_id" :options="city" id="selectuserrole">
                                                            <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione una Aseguradora</b-form-select-option>
                                                            </template>
                                                        </b-form-select>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Número de Poliza:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Monto Total Asegurado:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val Afectación de Poliza:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Deducible" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Cobertura Actual Poliza:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Provisiones Constituidas:" label-for="usr_name_first">
                                                        <b-form-input v-model="proc.usr_name_last" type="number" placeholder="Segundo Nombre"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Prescritas" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha Sentencia Primera Instancia" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha de Consulta" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha Sentencia Segunda Instancia" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha de Casación" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Sentencia Final:" label-for="usr_lastname_first">
                                                        <template v-for="(item,index) in state">
                                                        <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                                        </template>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Val Sentencia Final:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Disicriminar Valor de la Condena:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Costos de la Sentencia:" label-for="usr_name_first">
                                                    <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_name_first" type="numner" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                        <div class="invalid-feedback">
                                                        <span>{{ errors[0] }}</span>
                                                        </div>
                                                    </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Costos Procesales Primera Instancia:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Costos Procesales Segunda Instancia:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Total Costos:" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                </b-row>
                                            </div>
                                        </template>
                                        </iq-card>
                                    </b-col>
                                </b-row>
                            </form>
                            </ValidationObserver>
                        </b-col>
                    </b-row>
                </b-container>
            </tab-content>
            <tab-content title="Seguimiento">
                <b-container fluid>
                    <b-row>
                        <b-col md="12">
                            <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                            <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                                <b-row>
                                    <b-col lg="12">
                                        <iq-card>
                                        <template v-slot:body>
                                            <div class="new-user-info">
                                                <b-row>
                                                    <b-form-group class="col-md-6" label="Tipo de Proceso:" label-for="selectuserrole">
                                                        <b-form-select plain v-model="proc.usr_role_id" :options="roles" id="selectuserrole">
                                                            <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                            </template>
                                                        </b-form-select>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Juzgado:" label-for="usr_name_first">
                                                    <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                        <div class="invalid-feedback">
                                                        <span>{{ errors[0] }}</span>
                                                        </div>
                                                    </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Telefono/Celular Juzgado:" label-for="uname">
                                                        <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_username" type="number" placeholder="301545656" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                        <div class="invalid-feedback">
                                                            <span>{{ errors[0] }}</span>
                                                        </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Correo Electronico Juzgado:" label-for="uname">
                                                        <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                            <div class="invalid-feedback">
                                                                <span>{{ errors[0] }}</span>
                                                            </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Número de Radicado" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Objeto del Litigio:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Proceso Ejecutivo:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Ejecuntante:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Prestaciones/Capital/Interes/Honorarios:" label-for="usr_name_first">
                                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                            <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                                <div class="invalid-feedback">
                                                                    <span>{{ errors[0] }}</span>
                                                                </div>
                                                        </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha Sentencia Primera Instancia" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha de Consulta" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha Sentencia Segunda Instancia" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Fecha de Casación" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Año del Siniestro" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="Año de Notificación" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="DESCRIPCIÓN  DEL SINIESTRO" label-for="usr_name_first">
                                                    <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                        <div class="invalid-feedback">
                                                        <span>{{ errors[0] }}</span>
                                                        </div>
                                                    </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="FECHA DE RECIBIDO DE NOTIFICACION IPS" label-for="usr_birthday">
                                                        <b-form-input id="exampleInputdate" v-model="proc.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="COLABORADOR DE IPS QUE RECIBE NOTIFICACION:" label-for="usr_lastname_first">
                                                    <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                        <div class="invalid-feedback">
                                                        <span>{{ errors[0] }}</span>
                                                        </div>
                                                    </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="CIUDAD:" label-for="selectuserrole">
                                                        <b-form-select plain v-model="proc.usr_role_id" :options="city" id="selectuserrole">
                                                            <template v-slot:first>
                                                                <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                            </template>
                                                        </b-form-select>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="NOMBRE DEL PACIENTE:" label-for="usr_name_first">
                                                    <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                                        <b-form-input v-model="proc.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                                        <div class="invalid-feedback">
                                                        <span>{{ errors[0] }}</span>
                                                        </div>
                                                    </ValidationProvider>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="GENERO DEL PACIENTE:" label-for="usr_lastname_first">
                                                        <template v-for="(item,index) in state">
                                                        <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                                        </template>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-6" label="EDAD DEL PACIENTE" label-for="exampleInputNumber1">
                                                        <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                                    </b-form-group>
                                                </b-row>
                                            </div>
                                        </template>
                                        </iq-card>
                                    </b-col>
                                </b-row>
                            </form>
                            </ValidationObserver>
                        </b-col>
                    </b-row>
                </b-container>
            </tab-content>
        </form-wizard>
    </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import { FormWizard, TabContent } from 'vue-step-wizard'
import 'vue-step-wizard/dist/vue-step-wizard.css'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  name: 'AddUser',
  components: {
    FormWizard, TabContent
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      proc: {},
      roles: [
        { text: 'Administrador', value: 1 },
        { text: 'Abogado', value: 2 }
      ],
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 }
      ],
      city: [
        { value: 'Canada', text: 'Canada' },
        { value: 'Niada', text: 'Niada' },
        { value: 'USA', text: 'USA' },
        { value: 'India', text: 'India' },
        { value: 'Africa', text: 'Africa' }
      ],
      stateActive: {
        genero: 'active',
        number: 'two',
        colorDisabled: 'five',
        color: 'danger'
      },
      state: [
        {
          name: 'genero',
          label: 'Masculino',
          value: 'inactive',
          disabled: false
        },
        {
          name: 'genero',
          label: 'Femenino',
          value: 'active',
          disabled: false
        }
      ],
      users: []
    }
  },
  computed: {
    fullName: function () {
      return this.user.usr_name_first + ' ' + this.user.usr_lastname_first
    }
  },
  methods: {
    previewImage: function (event) {
      const input = event.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = e => {
          this.user.profile_image = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    onSubmit () {
      this.addUser()
    },
    addUser () {
      console.log('weeestupida', this.proc)
      axios.post('/process/store', this.proc).then(res => {
        console.log('Duque hptaaaa!! ' + res.data)
        if (res.data.status_code === 200) {
          this.$router.push({ name: 'doctor.list' })
        } else {
          alert('Datos no validos')
        }
      })
    }
  }
}
</script>
