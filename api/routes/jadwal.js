const express = require('express');
const pool = require('../../dbconnect');
const router = express.Router();
const bcrypt = require('bcrypt')
const authorization = require('./authorization')

router.get('/', async (req,res)=>{
    try{
        const sqlQuery ='SELECT jd.hari as hari_kode, t2.nama as hari, jd.nama, jd.time_from as mulai, jd.time_to as hingga FROM jadwal jd INNER JOIN namahari t2 ON t2.id=jd.hari ORDER BY jd.hari, jd.time_from';
        const rows = await pool.query(sqlQuery);
        if (rows.length>0){
            res.status(200).json({
                message:"success",
                result:rows
            });
        }
        else {
            res.status(400).json({
                message:"tidak ada data dari db",
                result:null
            })
        }
        
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
})
router.get('/jadwal_lengkap', async (req,res)=>{
    try{
        const sqlQuery ='CALL pJadwalSemua';
        const rows = await pool.query(sqlQuery);
        if (rows){
            res.status(200).json({
                message:"success",
                result:rows[0]
            });
        }
        else {
            res.status(400).json({
                message:"tidak ada data dari db",
                result:null
            })
        }
        
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
})
router.post('/mingguan/', async (req,res)=>{
    try{
        const {id_karyawan} = req.body;
        const sqlQuery ='CALL pKegiatanKaryawanMingguan (?)';
        const rows = await pool.query(sqlQuery, id_karyawan);
        if(rows.length > 0){
            res.status(200).json({
                message:"success",
                result:rows[0]
            });
        }else{
            res.status(400).json({
                message:"no data",
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
        const{hari, nama_kegiatan, jam_mulai, jam_selesai, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'INSERT INTO Jadwal (hari, nama, time_from, time_to) VALUE (?, ?, ?, ?)';
            const result = await pool.query(sqlQuery, [hari, nama_kegiatan, jam_mulai, jam_selesai ]);
            if(result){
                res.status(200).json({
                    message:"success",
                    result:[]
                })
            }else{
                res.status(400).json({
                    message:"db_fail",
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
    }
    catch(err){
        res.status(400).json({
            message:err.message,
            result:null
        })
    }
})
router.post('/hapus', async(req,res)=>{
    try{
        const{hari, nama_kegiatan, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'DELETE FROM Jadwal WHERE hari=? AND nama=?';
            const result = await pool.query(sqlQuery, [hari, nama_kegiatan ]);
            if(result){
                res.status(200).json({
                    message:"success",
                    result:[]
                })
            }else{
                res.status(400).json({
                    message:"db_fail",
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
    }
    catch(err){
        res.status(400).json({
            message:err.message,
            result:null
        })
    }
})
router.post('/kegiatan/tambah',async(req,res)=>{
    try{
        const{kode, nama_kegiatan, keterangan, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'INSERT INTO Kegiatan (kode, nama, keterangan) VALUE (?, ?, ?)';
            const result = await pool.query(sqlQuery, [kode, nama_kegiatan, keterangan ]);
            if (result){
                res.status(200).json({
                    message:"success",
                    result:[]
                })
            }else{
                res.status(400).json({
                    message:"fail write",
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
    }
    catch(err){
        res.status(400).json({
            message:err.message,
            result:null
        })
    }
});
router.post('/kegiatan/hapus', async(req,res)=>{
    try{
        const{kode, admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'DELETE FROM Kegiatan WHERE kode=?';
            const result = await pool.query(sqlQuery, kode);
            if(result){
                res.status(200).json({
                    message:"success",
                    result:[]
                })
            }else{
                res.status(400).json({
                    message:"db_fail",
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
    }
    catch(err){
        res.status(400).json({
            message:err.message,
            result:null
        })
    }
});
router.get('/kegiatan/list', async(req,res)=>{
    try{
        const sqlQuery ='SELECT kode, nama, keterangan FROM Kegiatan';
        const rows = await pool.query(sqlQuery);
        if (rows){
            res.status(200).json({
                message:"success",
                result:rows
            });
        }
        else {
            res.status(400).json({
                message:"tidak ada data dari db",
                result:null
            })
        }
        
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:null
        })
    }
});
router.post('/generate-jam-absensi-karyawan/', async (req,res)=>{
    try{
        const{admin_key} = req.body;
        const isValid = await authorization.auth_admin(admin_key)
        if (isValid){
            const sqlQuery = 'CALL pInsertKewajibanRepeat(0, 7);';
            const result = await pool.query(sqlQuery);
            if (result){
                res.status(200).json({
                    message:"success",
                    result:[]
                })
            }else{
                res.status(400).json({
                    message:"fail write",
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
    }
    catch(err){
        res.status(400).json({
            message:err.message,
            result:null
        })
    }
})


module.exports = router;