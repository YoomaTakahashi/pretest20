<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center text-h5">ผลการประเมินของผู้รับการประเมินผล</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="ค้นหา" class="mt-3"></v-text-field>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ผู้รับการประเมินผล</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center border">คะแนน</th>
                                    <th class="text-center border">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.fname }} {{ items.lname }}</td>
                                    <td class="text-center border">รอบการประเมินที่:{{items.round_sys}} ปี:{{ items.year_sys }}</td>
                                    <td class="text-center border">{{ formatDate(items.day_eva) }}</td>
                                    <td class="border text-center">{{ items.total_eva || 0 }}</td>
                                    <td class="text-center border">
                                       <v-btn class="text-center text-white ma-2" color="info" @click="go(items.id_eva)">รายละเอียด</v-btn> 
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
const eva = ref([])
const round = ref([])

const token = import.meta.client ? localStorage.getItem('token'):null

const fetch = async()=>{
    try {
        const res3 = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res3.data
    } catch (error) {
        console.error("Error get",error);
        
    }
}


const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear())
    
    return `${day}/${month}/${year}`
}
// const del = async(id_eva:number)=>{
//     if(!confirm("ต้องการลบข้อมูลชุดนี้ใช่หรือไม่"))return
//     try {
//         await axios.delete(`${staff}/eva/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
//         await fetch()
//     } catch (error) {
//         console.error("error delete",error);
        
//     }
// }

const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((items:any)=>{
        items.fname.toLowerCase().includes(s) || 
        items.lname.toLowerCase().includes(s) 
    })
})

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/score_member-${id_eva}`})
}

onMounted(fetch)

</script>

<style scoped>

</style>