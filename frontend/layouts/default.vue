<template>
    <v-app>
        <v-app-bar :color="bg(user.role)" flat :elevation="5">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">NTC Evaluation System</v-toolbar-title>
            <v-spacer></v-spacer>

            <p class="text-center">คุณ : {{ user.fname }} {{ user.lname }} <br> ตำแหน่ง : {{ user.role }}</p>&nbsp;&nbsp;
            <v-btn icon="mdi-logout" varaint="text" @click="logout" ></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" width="260" elevation="3" color="#404040" :temporary="isMobile" :permanent="!isMobile">
            <v-list density="comfortable">
                <v-list-item >
                    <v-list-item-title class="font-weight-bold"> NTC Evaluation System</v-list-item-title>
                    <div class="mt-3 font-weight-bold d-flex justify-left">
                        <v-chip variant="outlined" class="text-white"><h4>{{ user.role }}</h4></v-chip>
                    </div>
                </v-list-item>
            </v-list>
            <v-divider color="white" opacity="0.5" ></v-divider>

            <v-list density="comfortable">
                <v-list-item v-for="item in navitem" :key="item.title" :to="item.to" >
                    
                    <v-list-item-title class="font-weight-bold">
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class="py-2">
                <slot></slot>
            </v-container>
            <v-footer class="text-caption justify-center">© 2026 NTC Evaluation System</v-footer>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useDisplay } from 'vuetify/lib/composables/display.mjs';
import { consoleError } from 'vuetify/lib/util/console.mjs';
import { api } from '~/API/base';

const drawer = ref(false)
const user = ref<any>({})
const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)

const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const roles = [
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมิน',to:'/Staff/Manage_eva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการกรรมการประเมิน',to:'/Staff/Manage_commit',role:'ฝ่ายบุคลากร'},
    {title:'จัดการหัวข้อการประเมิน',to:'/Staff/Topic',role:'ฝ่ายบุคลากร'},
    {title:'จัดการตัวชี้วัด',to:'/Staff/indicate',role:'ฝ่ายบุคลากร'},
    {title:'จัดการรอบการประเมิน',to:'/Staff/Round',role:'ฝ่ายบุคลากร'},
    {title:'จัดการแบบประเมิน',to:'/Staff/Eva',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของผู้รับการประเมินผล',to:'/Staff/Score_evaList',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของกรรมการประเมิน',to:'/Staff/Score_commitList',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของผู้รับการประเมินผล',to:'/Staff/Status_eva',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของกรรมการประเมิน',to:'/Staff/Status_commit',role:'ฝ่ายบุคลากร'},
    {title:'เอกสารและคู่มือการประเมิน',to:'/Staff/Document',role:'ฝ่ายบุคลากร'},
    {title:'รายงาน',to:'/Staff/Report',role:'ฝ่ายบุคลากร'},
    {title:'การสำรองข้อมูล',to:'/Staff/backup',role:'ฝ่ายบุคลากร'},

    {title:'หน้าหลัก',to:'/Evalautee/',role:'ผู้รับการประเมินผล'},
    {title:'แก้ไขข้อมูลส่วนตัว',to:'/Evalautee/edit_eva',role:'ผู้รับการประเมินผล'},
    {title:'แบบประเมินตนเอง',to:'/Evalautee/selfeva',role:'ผู้รับการประเมินผล'},
    {title:'ตรวจสอบผลการประเมิน',to:'/Evalautee/check_score',role:'ผู้รับการประเมินผล'},
    {title:'รายงาน',to:'/Evalautee/report',role:'ผู้รับการประเมินผล'},
    {title:'คุ่มือการประเมิน',to:'/Evalautee/doc',role:'ผู้รับการประเมินผล'},

    {title:'รายชื่อผู้รับการประเมินผล',to:'/Committee/',role:'กรรมการประเมิน'},
    {title:'ดำเนินการประเมิน',to:'/Committee/show_eva',role:'กรรมการประเมิน'},
    {title:'ตรวจสอบและยืนยันผล',to:'/Committee/check_confirm',role:'กรรมการประเมิน'},
    {title:'คุ่มือการประเมิน',to:'/Committee/doc',role:'กรรมการประเมิน'},
]

const navitem = computed(()=> roles.filter((item)=> item.role.includes(user.value.role)))

const fetch = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        return navigateTo('/',{replace:true})
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error get profile',error)
    }
}
onMounted(fetch)

const bg = (role:string) =>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007FFF'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
}

const navbg = (role:string) =>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007FFF'
    if(role === 'ผู้รับการประเมินผล')return '#530000'
}
// const text = (role:string) =>{
//     if(role === 'ฝ่ายบุคลากร')return '#647687'
//     if(role === 'กรรมการประเมิน')return '#007FFF'
//     if(role === 'ผู้รับการประเมินผล')return '#D70000'
// }
</script>

<style scoped>
:root{
    background-color: #fff;
}
@media print {
    .v-app-bar,.v-btn.no-p{
        display: none !important;
        margin: 0 !important;
        margin-top: 0 !important;
        padding: 0 !important;
        width: 100% !important;
    }
}
</style>