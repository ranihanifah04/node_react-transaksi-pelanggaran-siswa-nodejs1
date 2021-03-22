const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") 

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req,res) => {
    const sql = "select * from pelanggaran"
    db.query(sql, (err, result) => {
        if(err) {
            throw err
        }else{
            let response = {
                count: result.length,
                pelanggaran: result
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })    
})

app.post("/", (req,res) => {
    let find = req.body.find
    let sql = "select * from pelanggaran where id_pelanggaran like '%"+find+"%' or nama_pelanggaran like '%"+find+"%' or poin like '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }else {
            let response = {
                count: result.length,
                pelanggaran: result
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})


app.post("/save", (req,res) => {
    let data = {
        id_pelanggaran: req.body.id_pelanggaran,
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: req.body.poin
    }
    let message = ""

    let sql = "insert into pelanggaran set ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row inserted"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})


app.post("/update", (req,res) => {
    let data = [{
        id_pelanggaran: req.body.id_pelanggaran,
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: req.body.poin
    }, req.body.id_pelanggaran]
    let message = ""

    let sql = "update pelanggaran set ? where id_pelanggaran = ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row updated"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})


app.delete("/:id_pelanggaran", (req,res) => {
    let data = {
        id_pelanggaran : req.params.id_pelanggaran
    } 
    let message = ""
    let sql = "delete from pelanggaran where ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row deleted"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

module.exports = app