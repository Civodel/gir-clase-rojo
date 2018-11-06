const mongoose = require('mongoose');
const URL = 'mongodb://BrokenDinosaurV3:BSdb123456789@ds119732.mlab.com:19732/bookshare';
mongoose.connect(URL,{userNewUrlParser:true},()=>{
    console.log('Data base connect succesful');
});

const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.ObjectId;


const userSchema =  new Schema({
    usuario:ObjectID,
    nombre:String,
    bsusername:String,
    biografia:{type:String},
    generosfavoritos:{
        type:[String],
        enum:['comedia','sobrenatural','ciencia_ficción','drama','terror','ciencia ficcion','sobrenatural'],
        require:'Tiene que ser un genero'

    },
    libros:[{
        type: mongoose.Schema.ObjectId,
        ref: 'BookS' }]
})
const UserS = mongoose.model('UserS',userSchema)

const bookSchema = new Schema({
    libro:ObjectID,
    titulo:String,
    portada:[String],
    genero:{
        type:[String],
        enum:['terror','sobrenatural','ciencia_ficción','romance','drama','melodrama','tragicomedia','comedia','tragedia','poesia','novela gráfica','suspenso','triller','arte','fantásia','misterio','aventura','arte meixicano','biografias','ciencia','cine','crítica literaria','diseño','diccionario','erotismo','filosofía','gastronomía','viaje','historia','musica','libro en ingles','literatura infantil','literatura juvenil','literatura mexicana','literatura oriental','literatura sobre gatos','moda','psicología','poesía mexicana','religión'],
        require:'Tiene que ser un genero'
    },
    autor:String,
    numero_de_paginas:Number,
    editorial:String,
    formato:{
        type:String,
        enum:['Tapa dura','Tapa blanda','plastificado','con sobrecubierta','enmicado','forrado'],
        require:'Debe de espeficiar un formato valido'
    },
    detalles:{
        type:String,
        default:'Sin detalles importantes'
    },
    bsusername:String,
    dueño:{ 
        type: mongoose.Schema.ObjectId, 
        ref:'UserS'}
});

const BookS = mongoose.model('BookS',bookSchema)
module.exports = {UserS,BookS}
