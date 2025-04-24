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
            const sqlQuery ='SELECT id, nama, telp, hashkey, createdAt, updatedAt FROM karyawan';
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
router.get('/bind/list', async(req,res)=>{
    try{
        const{id_karyawan} = req.body;
        //const isValid = await authorization.auth_admin(admin_key)
        const isValid = true
        if (isValid){
            const sqlQuery ='CALL pGetJadwalKaryawanBinding()';
            const rows = await pool.query(sqlQuery, id_karyawan);
            if (rows[0].length > 0){
                res.status(200).json({
                    message:"success",
                    result:rows[0]
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

router.get('/bind/list/:id', async(req,res)=>{
    try{
        const{id_karyawan} = req.body;
        //const isValid = await authorization.auth_admin(admin_key)
        const isValid = true
        if (isValid){
            const sqlQuery ='CALL pGetJadwalKaryawan(?)';
            const rows = await pool.query(sqlQuery, id_karyawan);
            if (rows[0].length > 0){
                res.status(200).json({
                    message:"success",
                    result:rows[0]
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

router.post('/bind/tambah', async(req, res)=>{
    try {
        const{id_karyawan, nama_karyawan, hari, nama_jadwal, kode_kegiatan, kelas, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'INSERT INTO jadwalkegiatankaryawan(id_karyawan, kode_kegiatan, kelas, hari, nama_jadwal) VALUE (?,?,?,?,?)';
            const result = await pool.query(sqlQuery, [id_karyawan, kode_kegiatan, kelas, hari, nama_jadwal]);
            if (result){
                res.status(200).json({
                    message:`berhasil, ${nama_karyawan} mengajar ${kode_kegiatan} pada ${hari}-${nama_jadwal}`,
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

router.post('/bind/hapus', async(req, res)=>{
    try {
        const{ hari, nama_jadwal, kode_kegiatan, kelas, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'DELETE FROM jadwalkegiatankaryawan WHERE hari=? AND nama_jadwal=? AND kelas=?';
            const result = await pool.query(sqlQuery, [hari, nama_jadwal, kelas]);
            if (result){
                res.status(200).json({
                    message:`berhasil, mengajar ${kode_kegiatan} pada ${hari}-${nama_jadwal}`,
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



module.exports = router;