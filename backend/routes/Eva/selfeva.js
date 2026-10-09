const express = require('express')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/file_eva')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const router = express.Router()

router.get('/user',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member  = req.user.id_member
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("Error get user",error);
        res.status(500).json({message:"Error get user"})
    }
})

router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member =req.user.id_member
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error("Error get topic",error);
        res.status(500).json({message:"Error get topic"})
    }
})

// router.post('/save',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
//     try {
//         const id_member = req.user.id_member
//         const fileMap = {}
//         const files = req.files || {}
//         const scores = 
//     } catch (error) {
        
//     }
// })

module.exports = router