const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT ||  3000;
const cors = require ('cors');
const app = express();
const {UserS,BookS} = require('./ClienteBS');

app.use(bodyParser.urlencoded({extended:true})) 
app.use(bodyParser.json())
app.use(cors())


//CRUD de Usuarios


app.post('/bookshare/nuevousuario', (req,res)=>{
    const {nombre,bsusername,biografia,generosfavoritos,libros}= req.body
    const nuevoUsuario= UserS({
        nombre,
        bsusername,
        biografia,
        generosfavoritos,
        libros
    })
    nuevoUsuario.save((error,nuevousuario)=>{
        error
        ? res.status(409).send(error)
        : res.status(200).send(nuevousuario)
    })
})

app.get('/bookshare/usuario/:uid',(req,res)=>{
    const {uid}= req.params
    UserS.findById((uid), (err,dueño)=>{
        BookS.populate(dueño,{path:"libros"},(err,dueño)=>{
            dueño
           ? res.status(200).send(dueño)
           : res.status(404).send({message:"usuario no encontrado "})
        })
    })
})


app.get('/bookshare/usuarios',(req,res)=>{
    UserS.find({}, (err,dueño)=>{
        BookS.populate(dueño,{path:"libros"},(err,dueño)=>{
            res.status(200).send(dueño)
        })
    })
})


app.put('/bookshare/cusuario/:uid',(req,res)=>{
    const {uid} = req.params
    UserS.findByIdAndUpdate(uid,{$set:req.body},{new:true}).exec()
    .then(newUser => res.status(200).send(newUser))
    .catch(error => res.status(400).send(error))
})

app.delete('/bookshare/dusuario/:uid',(req,res)=>{
    const {uid} = req.params
    UserS.findByIdAndDelete(uid).exec()
    .then(dusuario=>{
        dusuario
        ? res.status(200).send({message:"usuario borrado con exito"})
        : releaseEvents.status(404).send({message:"usuario no encontrado"})
    })
})

//CRUD de Libros

app.post('/bookshare/nuevolibro',(req,res)=>{
    const {titulo,portada,genero,autor,numerodepaginas,editorial,formato,detalles,bsusername,dueño}=req.body;
    const nuevoLibro = BookS({
        titulo,
        portada,
        genero,
        autor,
        numerodepaginas,
        editorial,
        formato,
        detalles,
        bsusername,
        dueño
    })
    nuevoLibro.save((error,nuevolibro)=>{
        error 
        ? res.status(409).send(error)
        : res.status(200).send(nuevolibro)
    })
})

app.get("/bookshare/libros",(req,res)=>{
    BookS.find({}).exec()
    .then(libros=>{
        libros
        UserS.populate(libros,{path: "dueño"},(error,libros)=>{
            libros
        ? res.status(200).send(libros)
        : res.status(404).send({message:"no existen libros"})
    })})
    .catch(error => res.status(404).send(error))
})

app.get('/bookshare/libro/:lid',(req,res)=>{
    const {lid} = req.params
    BookS.findById(lib).exec()
    .then(libro =>{
        libro
        ? res.status(200).send(libro)
        : res.status(404).send({message:"libro no encontrado"})
    })
    .catch(error=>{res.status(400).send(error)})
})

app.put('/bookshare/mlibro/:lib',(req,res)=>{
    const {lib} = req.params
    BookS.findByIdAndUpdate(lib,{$set:req.body},{new:true}).exec()
    .then(librom=>res.send(librom))
    .catch(error => res.send(error))
})

app.delete('bookshare/dlibro/:lid',(req,res)=>{
    const {lid} = req.params
    BookS.findByIdAndDelete(lib).exec()
    .then(libro=>{
        libro
        ? res.status(200).send({message:"libro borrado con exito"})
        : res.status(404).send({message:"libro no encontrado "})
    })
})

//pruebas

/*
app.get("/libros/:usuario",(req, res)=> {
    const {usuario} = req.params
    const nuevousuario=usuario.trim().toLowerCase();
    if(nuevousuario === bsusername.trim().toLowerCase())
	UserS.findOne({nu   evousuario:usuario.trim().toLowerCase()},(err, libros)=> {
    	BookS.populate(libros, {path: "bs"},(err, libros)=>{
        	res.status(200).send(libros);
        }); 
    });
});
*/
/*
function getUserWithPosts(username){
    return UserS.findOne({ username: username })
      .populate('libros').exec((err, libros) => {
        console.log("Populated User " + libros);
      })
  }
*/
/*
app.get('/bookshare/usuarios',(req,res)=>{
    UserS.find().exec()
    .then(usuarios => res.status(200).send(usuarios))
    .catch(error => res.status(409).send(error))
})
*/
//console.log(getUserWithPosts("Broken Dinosaur"));
/*app.get("/libros", (req, res) =>{
	BookS.find({}, (err, libros)=> {
    	UserS.populate(libros, {path: "dueño"},(err, libros)=>{
            libros
            ? res.status(200).send(libros)
            : res.status(404).send({message:"no existen libros"})
        }); 
    });
});
*/


app.listen(PORT,()=>{
    console.log(`Server on ${PORT} is ON`);
})
