const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT ||  3000;
const cors = require ('cors');
const app = express();
const {UserS,BookS} = require('./ClienteBS');
const axios= require('axios')


app.use(bodyParser.urlencoded({extended:true})) 
app.use(bodyParser.json())
app.use(cors())


//CRUD de Usuarios


app.post('/bookshare/nuevousuario', (req,res)=>{
    const {usuario,nombre,bsusername,correo,contraseña,biografia,generosfavoritos,libros}= req.body
    const nuevoUsuario= UserS({
        usuario,
        nombre,
        bsusername,
        correo,
        contraseña,
        biografia,
        generosfavoritos,
        libros
    })
    
    nuevoUsuario.save((error,nuevousuario)=>{
        error
        ? res.status(409).send({message: "usuario/correo ya existente", error}) 
        : res.status(200).send({message:"usuario creado con exito",nuevousuario})
    })
    /*
if(UserS.findOne({bsusername:nuevoUsuario.bsusername},()=>{res.send(true)})== true){
    console.log("puto el que lo lea");
}
else{console.log("tambien puto");}
       /*
     console.log(UserS.findOne({bsusername:nuevoUsuario.bsusername},(error,bsusername)=>{
         bsusername
         ? res.status(200).send({message:"Username already exist"})
         : res.status(404).send(error)

     })
     
     
);
*/

/*
    if( bsusername ===((bsusername)=>{
        UserS.findOne({ bsusername: bsusername}).exec()
        .then(res.status(200).send({message:"usuario existente"}))
        .catch(
            nuevoUsuario.save((error,nuevousuario)=>{
                error
                ? res.status(409).send(error) 
                : res.status(200).send({message:"usuario creado con exito",nuevousuario})
            })
        )
    }))
    */

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
        : res.status(404).send({message:"usuario no encontrado"})
    })
})

//CRUD de Libros

app.post('/bookshare/nuevolibro',(req,res)=>{
    const {libro,titulo,portada,genero,autor,numerodepaginas,editorial,formato,detalles,bsusername,dueño,estado}=req.body;
    const nuevoLibro = BookS({
        libro,
        titulo,
        portada ,
        genero,
        autor,
        numerodepaginas,
        editorial,
        formato,
        detalles,
        bsusername,
        dueño,
        estado
    })
    
    const urlp = `https://www.googleapis.com/books/v1/volumes?q=${nuevoLibro.titulo}`

     axios.get(urlp)
    .then(response=>{
        
        nuevoLibro.portada=response.data.items[0].volumeInfo.imageLinks.thumbnail
        nuevoLibro.save((error,nuevolibro)=>{
            nuevoLibro
            ? res.status(200).send({message:"Libro creado con exito",nuevolibro})
            : res.status(409).send(error)
        }) 
    })
    .catch(error=>res.send(error))


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
    BookS.findById(lid).exec()
    .then(libro =>{
        libro
        ? res.status(200).send(libro)
        : res.status(404).send({message:"libro no encontrado"})
    })
    .catch(error=>{res.status(400).send(error)})
})

app.put('/bookshare/mlibro/:lib',(req,res)=>{
    const {lid} = req.params
    BookS.findByIdAndUpdate(lid,{$set:req.body},{new:true}).exec()
    .then(librom=>res.send(librom))
    .catch(error => res.send(error))
})

app.delete('bookshare/dlibro/:lid',(req,res)=>{
    const {lid} = req.params
    BookS.findByIdAndDelete(lid).exec()
    .then(libro=>{
        libro
        ? res.status(200).send({message:"libro borrado con exito"})
        : res.status(404).send({message:"libro no encontrado "})
    })
})
//CRUD de Prestamo
/*
app.post('bookshare/nuevoprestamo',(req,res)=>{
    const {prestamo,dueño,usuariobeneficiado,libros,esta_prestado}=req.body
    const nuevoPrestamo= PrestamoS({
        prestamo,
        dueño,
        usuariobeneficiado,
        libros,
        esta_prestado
    })
    nuevoPrestamo.save((error,nuevoprestamo)=>{
        prestamo
        ? res.status(200).send(nuevoprestamo)
        : res.status(404).send(error)        
    })
})

app.get('bookshare/prestamos',(req,res)=>{
    PrestamoS.find({}).exec()
    .then(prestamos=>{
        prestamos
        UserS.populate(prestamos,{path:"dueño"},(error,prestamos)=>{
            prestamos
         ? res.status(200).send(prestamos)
        : res.status(404).send({message:"sin dueño",error})
        })
        UserS.populate(prestamos,{path:"usuariobeneficiado"},(error,prestamos)=>{
            prestamos
         ? res.status(200).send(prestamos)
        : res.status(404).send({message:"sin dueño",error})
        })
        BookS.populate(dueño,{path:"libros"},(error,dueño)=>{
            dueño
           ? res.status(200).send(dueño)
           : res.status(404).send({message:"sin libros",error})
            
        })
    })
    })
*/
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
