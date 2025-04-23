const express = require('express');
const pool = require('../../dbconnect');
const router =express.Router();
const keygenerator = require('keygen');
const bcrypt = require('bcrypt')
const authorization = require('./authorization')

router.post('/karyawan', async(req, res)=>{
    try {
        const{nama_karyawan, telp, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'INSERT INTO Karyawan (nama, telp) VALUE (?,?)';
            const result = await pool.query(sqlQuery, [nama_karyawan, telp]);
            if (result){
                res.status(200).json({
                    message:`success, insert ${nama_karyawan}`,
                    result:[]
                })
            }else{
                res.status(200).json({
                    message:"fail query",
                    result:[]
                })
            }
            
        }
        else{
            res.status(401).json({
                message:"unauthorized",
                result:[]
            })
        }
    } catch (err) {
        res.status(400).json({
            message:err.message,
            result:[]
        })
    }

});

router.post('/karyawan/hapus', async(req,res)=>{
    try {
        const{id_karyawan, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'DELETE FROM Karyawan WHERE id=?';
            const result = await pool.query(sqlQuery, id_karyawan);
            if (result){
                res.status(200).json({
                    message:`success, hapus karyawan`,
                    result:[]
                })
            }else{
                res.status(200).json({
                    message:"fail query",
                    result:[]
                })
            }
            
        }
        else{
            res.status(401).json({
                message:"unauthorized",
                result:[]
            })
        }
    } catch (err) {
        res.status(400).json({
            message:err.message,
            result:[]
        })
    }
});

router.post('/unlock_karyawan', async(req,res)=>{
    try{
        const{id_karyawan, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'UPDATE Karyawan SET hashkey = (?) WHERE id =(?)';
            const result = await pool.query(sqlQuery, ["-", id_karyawan]);
            res.status(200).json({
                message:"success",
                result:[]
            })
        }
        else{
            res.status(401).json({
                message:"unauthorized",
                result:[]
            })
        }
    }
    catch(err){
        res.status(400).json({
            message:err.message,
            result:null
        })
    }
});

router.post('/device_claim', async(req,res)=>{
    try{
        const{id_karyawan} = req.body;
        const sqlQueryCheck ='SELECT id, nama, hashkey, createdAt, updatedAt FROM Karyawan WHERE id=?';
        const rows = await pool.query(sqlQueryCheck, id_karyawan);
        if (rows.length > 0 && rows[0].hashkey == "-"){
            const secretkey = await keygenerator.url(50);
            const hashkey = await bcrypt.hash(secretkey, 10)
            const sqlQuery = 'UPDATE Karyawan SET hashkey =? WHERE id =?';
            const result = await pool.query(sqlQuery, [hashkey, id_karyawan]);
            res.status(200).json({
                message:"success",
                result:{
                    userId: rows[0].id, 
                    userName: rows[0].nama,
                    key: secretkey
                }
            })
        }else{
            res.status(401).json({
                message:"gagal, akun telah diklaim device lain",
                result: null
            })
        }
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
});

module.exports = router;
