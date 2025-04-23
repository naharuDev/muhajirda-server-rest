const express = require('express');
const pool = require('../../dbconnect');
const router = express.Router();
const util = require('./util')

router.get('/alpha_pagi_count/:id', async (req,res)=>{
    try{
        const sqlQuery ='CALL pStatistikAbsenPagi(?, ?)';
        const rows = await pool.query(sqlQuery, [req.params.id, req.body.jumlah_bulan]);
        res.status(200).json({
            message:"success",
            result:rows[0]
        });
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:[]
        })
    }
})

router.get('/alpha_siang_count/:id', async (req,res)=>{
    try{
        const sqlQuery ='CALL pStatistikAbsenSiang(?, ?)';
        const rows = await pool.query(sqlQuery, [req.params.id,req.body.jumlah_bulan]);
        res.status(200).json({
            message:"success",
            result:rows[0]
        });
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:[]
        })
    }
})

router.get('/total_terlambat/:id', async (req,res)=>{
    try{
        const sqlQuery ='CALL pStatistikAbsenKeterlambatan(?, ?)';
        const rows = await pool.query(sqlQuery, [req.params.id,req.body.jumlah_bulan]);
        res.status(200).json({
            message:"success",
            result:rows[0]
        });
    }catch(err){
        res.status(400).send({
            message:err.message,
            result:[]
        })
    }
})

module.exports = router;