<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-alert v-if="user.status_eva === 1">ผู้รับการประเมินยังไม่ได้ประเมินตนเอง</v-alert>
                <v-form v-else-if="user.status_commit === 2" @submit.prevent="saveScore">
                    <h1 class="font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="pa-5 py-2 " rounded elevation="5">
                     <p >คุณ : {{ user.fname }} {{ user.lname }} </p>
                     <p >รอบประเมินที่ : {{ user.round_sys }} ปี : {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="font-weight-bold">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-card class="pa-5 py-2" rounded elevation="5">
                                <v-row v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        {{ t+1 }}.{{ i+1 }} {{ indicate.name_indicate }} รายละเอียดตัวชี้วัด : {{ indicate.detail_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม : {{ indicate.point_indicate*4 }}
                                        <p class="mt-2">รายละเอียด: {{ indicate.detail_eva || '-' }}</p>
                                        <p class="mt-2">file: <v-btn v-if="indicate.file_eva" size="smail" @click="viveFile(imdicate.file_eva)" color="blue"></v-btn> <span v-else>-</span> </p>
                                        <v-select v-if="indicate.check_indicate === 'y'" label="ใส่คะแนน 1-4 " :items="[1,2,3,4]" variant="solo-filled" v-model="indicate.score" ></v-select>
                                        <v-text-field v-else-if="indicate.check_indicate === 'n'" label="ใส่คะแนน 1-4 " :items="[1,2,3,4]" variant="solo-filled" v-model="indicate.score" @input="indicate.score > 4 ? indicate.score = 4 :null" type="number" min="1"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-4">
                        <v-card class="pa-2">
                            <label for="">ข้อเสนอแนะ</label>
                            <v-textarea label="(ถ้ามี)" v-model="detail_commit" rows="2"></v-textarea>
                        </v-card>
                    </div>
                    <div class="text-center mt-3">
                        <v-btn color="blue" type="submit" class="no-p">บันทึกคะแนน</v-btn>
                    </div>
                </v-form>
                <v-alert type="success" v-else-if="user.status_commit === 'y'">ประเมินสำเร็จ</v-alert>
                <v-alert type="warning" v-else>ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {commit} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])
const detail_commit = ref('')
const id_eva = useRoute().params.id_eva

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/file_eva/${filename}`
    window.open(url,'_blank')
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}
const fetchTopics = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopics()])
})

const saveScore = async () =>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap((t:any) =>
        t.indicates.map((i:any) =>{
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
            }
        })
    )
    if(allScore.some((s:any) => !s.score)){
        alert('กรุณากรอกคะแนนให้สมบูรณ์')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    const detail_commitTo = ref('')
    if(detail_commit.value && detail_commit.value.trim()){
        detail_commitTo.value = detail_commit.value
    }else{
        detail_commitTo.value = 'ไม่มี'
    }
    formData.append('detail_commit',detail_commitTo.value)
    try{
        await axios.post(`${commit}/save_score/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        await Promise.all([fetchUser(),fetchTopics()])
        navigateTo('/Committee/Check_confirm',{replace:true})
    }catch(err){
        console.error('Error POST Score!',err)
    }
}
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