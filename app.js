
const express = require('express');
const app = express();
const pool = require('./dbconnect')
const bodyParser = require('body-parser')
const keygenerator = require('keygen');
const bcrypt = require('bcrypt')


const secret = `/${process.env.SECRET_LINK}`

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res)=>{
    res.json({
        message:'server is running',
        result: null
    })
})

app.get('/db_test', async (req, res) => {

    try {
        const rows = await pool.query("SELECT * FROM NamaHari");
        if (rows){
            res.status(200).json({
                message:"database working",
                result: null
            });
        }
        else{
            res.status(400).json({
                message:"database not working",
                result: null
            })
        }
        
    } catch (err) {
        res.status(400).json({
            message:"database not working",
            result: err.message
        })
    }
});

app.get(secret, async (req,res)=>{
    try{
        const{user_key} = req.body
        let key
        if (user_key == undefined ){
            key = await keygenerator.url(5)
        }else{
            key = user_key
        }
        const en_key = await bcrypt.hash(key, 10)
        res.status(200).json({
            message:"success",
            result:{
                key:key,
                db_key:en_key
            }
        });
    }catch(err){
        res.status(400).send({
            message:"fail",
            result:err.message
        })
    }
})

const kelas = require('./api/routes/kelas');
app.use('/kelas', kelas)

const libur = require('./api/routes/libur');
app.use('/libur', libur)

const register = require('./api/routes/register');
app.use('/register', register);

const jadwal = require('./api/routes/jadwal');
app.use('/jadwal', jadwal);

const absensi = require('./api/routes/absensi');
app.use('/absensi', absensi);

const statistik = require('./api/routes/statistik');
app.use('/statistik', statistik);

const karyawanRoute = require('./api/routes/karyawan');
app.use('/karyawan', karyawanRoute);

module.exports = app