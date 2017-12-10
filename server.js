const express = require("express")
const bodyParser=require('body-parser')
const Sequelize = require("sequelize")
const nodeadmin=require("nodeadmin")


const sequelize =new Sequelize('restaurante_bd','root','',{
    dialect: 'mysql',
    host:'localhost'
})


const Biblioteca =sequelize.define('biblioteca',{
    id_biblioteca: Sequelize.INTEGER,
    nume_biblioteca: Sequelize.STRING,
    adresa_biblioteca: Sequelize.STRING,
    tip_biblioteca: Sequelize.STRING
})


const Carti=sequelize.define('reviews',{
    id_carte: Sequelize.INTEGER,
    id_biblioteca: Sequelize.INTEGER,
    nr_specializari: Sequelize.INTEGER
})
    

Biblioteca.hasMany(Reviews,{foreignKey: 'cheie_biblioteca'})

const app=express();
app.use(bodyParser.json());
app.use('/nodeadmin',nodeadmin(app))


app.get('/createBiblioteca',(req,res)=>{
    sequelize.sync({force:true})
    .then(()=>res.status(201).send('tabela Biblioteca creata'))
    .catch(()=>res.status(500).send('eroare create Biblioteca'))
})


app.get('/biblioteca',function(request,response)
{
    Biblioteca.findAll().then(function(biblioteca)
    {
        response.status(200).send(biblioteca)
    })
})


app.get('/createCarti',(req,res)=>{
    sequelize.sync({force:true})
    .then(()=>res.status(201).send('tabela carti creata'))
    .catch(()=>res.status(500).send('eroare create carti'))
})


app.get('/carti',function(request,response)
{
    Carti.findAll().then(function(carti)
    {
        Carti.status(200).send(carti)
    })
})


app.get('/biblioteca /:name',(req,res)=>{
     Biblioteca.findAll({where: {nume_biblioteca:req.params.name}})
         .then((biblioteca)=>{
             //intru aici si daca message e nimic
             if(biblioteca){
                 //trimit la user
                 res.status(200).json(biblioteca)
             }
             else{
                 //am o eroare 
              res.status(404).send('not found...')
            }
         })
     .catch(()=> res.status(500).send('error3...')) 
        
})


app.post('/biblioteca/nou', function(request, response) {
Biblioteca.create(request.body).then(function(biblioteca) {
        response.status(201).send(biblioteca)
    })
})


app.post('/carti /nou',function(request,response){
    Carti.create(request.body).then(function(carti){
        response.status(201).send(carti)
    })
})


app.delete('/biblioteca/:id', (req,res)=>
{
    Biblioteca.findById(req.params.id).then((Biblioteca)=>{
        if(Biblioteca){
            return Biblioteca.destroy()
        }
        else
        {
            res.status(404).send("Nu am gasit biblioteca!")
        }
    }).then(()=>res.status(201).send('Destroyed')).catch(()=>res.status(500).send("Eroare tabela biblioteca!"))
})

app.delete('/carti/:id', (req,res)=>
{
     Carti.findById(req.params.id).then((carti)=>{
        if(carti){
            return carti.destroy()
        }
        else
        {
            res.status(404).send("Nu am gasit cartea!")
        }
    }).then(()=>res.status(201).send('Destroyed'))
    .catch(()=>res.status(500).send("Eroare tabela carti!"))
})


app.put('/biblioteca /:id', function(request, response) {
    Biblioteca.findById(request.params.id).then(function(restaurants) {
        if(Biblioteca) {
            Biblioteca.update(request.body).then(function(biblioteca){
                response.status(201).send(biblioteca)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})
        

app.listen(8080)

