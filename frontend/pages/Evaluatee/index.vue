<template>
    <v-container>
        <v-card >
            <v-sheet class="pa-5  text-center" >
                <h1 class="font-weight-bold">DashBoard - Evaluatee</h1>
            </v-sheet>
            <v-card-text>
                <v-row>
                    <v-col md="4" cols="12" v-for="b in box" :key="b">
                        <v-card elevation="5" rounded class="pa-5 py-4">
                            <div class="text-center text-h5">{{ b.title }}</div>
                            <div class="text-center text-h5">{{ b.value }}</div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api } from '~/API/base';

const box = ref([])
const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
    } catch (error) {
        console.error('error get box',error)
    }
}
onMounted(fetch)
</script>

<style scoped>

</style>