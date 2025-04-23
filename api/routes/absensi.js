const express = require('express');
const pool = require('../../dbconnect');
const router = express.Router();
const util = require('./util')
const authorization = require('./authorization')

router.get('/harian/:id', async (req,res)=>{
    try{
        const sqlQuery ='CALL pCheckAbsensiHarian(?)';
        const rows = await pool.query(sqlQuery, req.params.id);
        if (rows[0].length > 0){
            res.status(200).json({
                message:"success",
                result: rows[0]
            });
        }else{
            res.status(200).json({
                message:"tidak ada kewajiban absensi pada hari ini",
                result: null
            });
        }
        
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:[]
        })
    }
})

router.get('/mingguan/:id', async (req,res)=>{
    try{
        const sqlQuery ='CALL pCheckAbsensiMingguan (?)';
        const rows = await pool.query(sqlQuery, req.params.id);
        if (rows[0].length > 0){
            res.status(200).json({
                message:"success",
                result:rows[0]
            });
        }
        else{
            res.status(200).json({
                message:"tidak ada kewajiban absensi pada minggu ini",
                result:null
            });
        }
        
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:[]
        })
    }
})

router.post('/ttd/', async (req,res)=>{
    try{
        const {id_karyawan, key} = req.body;
        const auth = await authorization.check_hash(pool, id_karyawan, key )
        if (auth.authorized == false){
            console.log(auth.message)
            res.status(401).json({
                message:"unauthorized, "+auth.message,
                result:[]
            });
        }
        else{
            const sqlQuery ='CALL pCheckAbsensiHarian (?)';
            const rows = await pool.query(sqlQuery, id_karyawan);
            if(rows[0].length < 1){
                res.status(200).json({
                    message:"tidak ada kewajiban absen",
                    result:[]
                });
            }
            else{
                var now = new Date(); // for now
                var jam_pagi = util.mariadb_time_to_date(rows[0][0].jam_pagi);
                console.log(jam_pagi)
                var jam_siang = util.mariadb_time_to_date(rows[0][0].jam_siang);
                console.log(jam_siang)
                var tipeAbsen = util.get_absen_enum(now, jam_pagi, jam_siang);
                console.log(tipeAbsen)
                if(tipeAbsen.absensiEnum == 'belum'){
                    res.status(200).json({
                        message:"pencatatan absensi, dimulai jam 6 pagi",
                        result:rows[0]
                    })
                }
                else if (tipeAbsen.absensiEnum == 'siang'){
                    if (rows[0][0].absen_siang == null){
                        const sqlQuerySiang ='INSERT INTO AbsensiSiang(id_karyawan, tanggal, waktu_ttd) VALUE (?, ?, ?)';
                        const resultSiang = await pool.query(sqlQuerySiang, [id_karyawan, `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`, `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`]);
                        res.status(201).json({
                            message: 'berhasil absen siang',
                            result:[]
                        })
                    }
                    else {
                        res.status(200).json({
                            message:"sudah absen siang",
                            result:rows[0]
                        })
                    }
                }
                else if(tipeAbsen.absensiEnum == 'none'){
                    res.status(200).json({
                        message:"belum ada pencatatan absen",
                        result:[]
                    });
                }
                else{
                    if (rows[0][0].absen_pagi == null){
                        const sqlQueryPagi ='INSERT INTO AbsensiPagi(id_karyawan, tanggal, waktu_ttd, keterlambatan) VALUE (?, ?, ?, ?)';
                        const resultPagi = await pool.query(sqlQueryPagi, [id_karyawan, `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`, `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`, tipeAbsen.keterlambatan ]);
                        res.status(201).json({
                            message: `berhasil absen pagi, keterlamatan : ${tipeAbsen.keterlambatan}`,
                            result:[]

                        })
                    }
                    else{
                        res.status(200).json({
                            message:"sudah absen pagi",
                            result:rows[0]
                        })
                    }
                }
            }
        }
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
})

router.post('/rekap', async(req, res)=>{
    try{
        const {id_karyawan, jumlah_bulan} = req.body;
        const sqlQuery ='CALL pCheckAbsensiBulanan (?, ?)';
        const rows = await pool.query(sqlQuery, [id_karyawan, jumlah_bulan]);
        if (rows[0].length > 0){
            res.status(200).json({
                message:"success",
                result:rows[0]
            });
        }
        else{
            res.status(200).json({
                message:"data absensi tidak ditemukan",
                result:null
            });
        }
        
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:[]
        })
    }
})

router.get('/rekapall', async(req,res)=>{
    try{
        const {jumlah_bulan} = req.body;
        const sqlQuery ='CALL pRekapAlphaBulanan(?)';
        const rows = await pool.query(sqlQuery, jumlah_bulan);
        if (rows[0].length > 0){
            res.status(200).json({
                message:"success",
                result: rows[0]
            });
        }else{
            res.status(200).json({
                message:"tidak ada data",
                result: null
            });
        }
        
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:[]
        })
    }
})



module.exports = router;