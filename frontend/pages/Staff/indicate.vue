<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">จัดการตัวชี้วัด</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select label="หัวข้อการประเมิน" v-model="form.id_topic" :error-messages="error.id_topic" :items="topics.map((t)=>({title:t.name_topic,value:t.id_topic}))"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อตัวชี้วัด" v-model="form.name_indicate" :error-messages="error.name_indicate"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-textarea label="รายละเอียดตัวชี้วัด" v-model="form.detail_indicate" :error-messages="error.detail_indicate" rows="3"></v-textarea>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="น้ำหนักคะแนน" v-model="form.point_indicate" :error-messages="error.point_indicate" :items="[1,2,3,4,5]"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ประเภทตัวเลือก" v-model="form.check_indicate" :error-messages="error.check_indicate" :items="[{title:'มี',value:'y'},{title:'ไม่มี',value:'n'}]"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">{{form.id_indicate ? 'อัปเดต':'บันทึก'}}</v-btn>
                                        <v-btn class="text-center ma-2" color="error" type="reset">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="ค้นหา" class="mt-3"></v-text-field>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">หัวข้อการประเมิน</th>
                                    <th class="text-center border">ชื่อตัวชี้วัด</th>
                                    <th class="text-center border">รายละเอียดตัวชี้วัด</th>
                                    <th class="text-center border">น้ำหนักคะแนน</th>
                                    <th class="text-center border">ประเภทตัวเลือก</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_indicate">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.name_topic }}</td>
                                    <td class="text-center border">{{ items.name_indicate }}</td>
                                    <td class="text-center border">{{ items.detail_indicate || '-' }}</td>
                                    <td class="text-center border">{{ items.point_indicate }}</td>
                                    <td class="text-center border">{{ items.check_indicate === 'y' ? 'มี':'ไม่มี' }}</td>
                                    <td class="text-center border">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                            <v-btn class="text-center text-white ma-2" color="error" @click="del(items.id_indicate)">ลบ</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="border text-center text-red" colspan="12" v-if="result.length===0">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'


const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const search = ref('')
const dataResult = ref([])
const topics = ref([])
const show = ref(false)
const showPw = ref(false)
const form = ref({
    id_indicate:null,
    id_topic:'',
    name_indicate:'',
    detail_indicate:'',
    point_indicate:'',
    check_indicate:''
})

const reset= ()=>{
    form.value = {
        id_indicate:null,
        id_topic:'',
        name_indicate:'',
        detail_indicate:'',
        point_indicate:'',
        check_indicate:''
    }
}

const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){
    const f = form.value
    error.value = {}

    if(!f.id_topic)error.value.id_topic = 'กรุณากรอกหัวข้อการประเมิน'
    if(!f.name_indicate.trim())error.value.name_indicate = 'กรุณากรอกชื่อตัวชี้วัด'
    if(!f.point_indicate)error.value.point_indicate = 'กรุณาเลือกน้ำหนักคะแนน'
    if(!f.check_indicate)error.value.check_indicate = 'กรุณาเลือกประเภทตัวเลือก'
    return Object.keys(error.value).length === 0

}
const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{

    if(!validateForm())return
    const f = form.value
    try {
        f.id_indicate
        ? await axios.put(`${staff}/indicate/update/${f.id_indicate}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/indicate/save`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert("ทำรายการสำเร็จ")
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error save",error);
        
    }

}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/indicate/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
        const res2 = await axios.get(`${staff}/topic/show`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error("Error get",error);
        
    }
}

const edit = (items:any)=>{

    form.value = {...items}

}

const del = async(id_indicate:number)=>{
    if(!confirm("ต้องการลบข้อมูลชุดนี้ใช่หรือไม่"))return
    try {
        await axios.delete(`${staff}/indicate/delete/${id_indicate}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
        
    }
}

const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((items:any)=>{
        items.name_indicate.toLowerCase().includes(s)
    })
})

onMounted(fetch)

</script>

<style scoped>

</style>