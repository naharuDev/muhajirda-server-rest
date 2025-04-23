const express = require('express');
const pool = require('../../dbconnect');
const router =express.Router();
const authorization = require('./authorization')

router.get('/list', async(req,res)=>{
    try{
        const{admin_key} = req.body;
        //const isValid = await authorization.auth_admin(admin_key)
        const isValid = true
        if (isValid){
            const sqlQuery ='SELECT tanggal, keterangan FROM HariLibur';
            const rows = await pool.query(sqlQuery);
            if (rows.length > 0){
                res.status(200).json({
                    message:"success",
                    result:rows
                });
            }else{
                res.status(200).json({
                    message:"no data",
                    result:[]
                });
            }
        }else{
            res.status(401).json({
                message:"unauthorized",
                result:[]
            });
        }
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
})

router.post('/tambah', async(req,res)=>{
    try{
        const{tanggal, jumlah_hari, keterangan, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery ='CALL pInsertHariLibur (?,?,?)';
            const rows = await pool.query(sqlQuery,[tanggal, jumlah_hari, keterangan]);
            if (rows){
                res.status(200).json({
                    message:"success",
                    result:rows
                });
            }else{
                res.status(200).json({
                    message:"gagal tambah, masalah db",
                    result:[]
                });
            }
        }else{
            res.status(401).json({
                message:"unauthorized",
                result:[]
            });
        }
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
})

router.post('/hapus', async(req,res)=>{
    try{
        const{tanggal, jumlah_hari, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery ='CALL pDeleteHariLibur (?,?)';
            const rows = await pool.query(sqlQuery, [tanggal, jumlah_hari]);
            if (rows.length > 0){
                res.status(200).json({
                    message:"success",
                    result:rows
                });
            }else{
                res.status(200).json({
                    message:"gagal tambah masalah db",
                    result:[]
                });
            }
        }else{
            res.status(401).json({
                message:"unauthorized",
                result:[]
            });
        }
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
})

module.exports = router;