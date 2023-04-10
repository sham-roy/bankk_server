// import express and store in a variable
const express = require("express")

// import cors
const cors=require("cors")

// import ds
const ds = require('./service/dataService')

// import jswt 
const jwt = require("jsonwebtoken")
const { request } = require("express")


// app creation
const app = express()

// to integrate app with frontend
app.use(cors({origin:'http://localhost:4200'}))

// to convert all datas from json to js
app.use(express.json())

// middleWare creation
const jwtMiddleWare = (req, res, next) => {

    try {
        // access data from request body
        const token = req.headers['access_token']

        // verify the token with secrat key
        const data = jwt.verify(token, "superkey123")

        // console.log(data);
        next()
    }
    catch {
        res.status(422).json({
            status: false,
            message: "please login",
            statusCode: 404
        })
    }
}

// register post
app.post("/register", (req, res) => {

    ds.register(req.body.acno, req.body.uname, req.body.psw).then(result => {
        res.status(result.statusCode).json(result)

    })
})

// login
app.post("/login", (req, res) => {
    ds.login(req.body.acno, req.body.psw).then(result => {
        res.status(result.statusCode).json(result)
    })
})
// deposite
app.post("/deposit", jwtMiddleWare, (req, res) => {
    ds.deposit(req.body.acno, req.body.psw, req.body.amnt).then(result => {
        res.status(result.statusCode).json(result)
    })
})

// withdraw
app.post("/withdraw", jwtMiddleWare, (req, res) => {
    ds.withdraw(req.body.acno, req.body.psw, req.body.amnt).then(result => {
        res.status(result.statusCode).json(result)

    })
})

// transaction
app.post("/transcation", jwtMiddleWare, (req, res) => {
     ds.getTranscation(req.body.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// delete
app.delete("/delete/:acno",jwtMiddleWare,(req,res)=>{
    ds.deleteAcc(req.params.acno).then(result=>{
        res.status(res.statusCode).json(result)
    })
})

// // resolve api
// app.get("/",(req,res)=>{
//     res.send('get method working')
// })

// app.post("/",(req,res)=>{
//     res.send('post method working')
// })
// app.delete("/",(req,res)=>{
//     res.send('delete method working')
// })

// app.put("/",(req,res)=>{
//     res.send('put method working')
// })
// app.patch("/",(req,res)=>{
//     res.send('patch method working')
// })


// port set      (method)
app.listen(3000, () => {
    console.log("server started at port 3000");
})

