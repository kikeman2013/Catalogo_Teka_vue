const ProductoSchema = require('../models/Producto.js');
const Rating = require('../models/Rating.js');
const passport = require('passport');

module.exports.controllers = (app) => {
  //obtener productos
  app.get('/productos', function(req , res) {
    ProductoSchema.find({}, 'name description code price type pic',
    (error , productos) => {
      if(error){ console.log(error) }
      res.send({
        productos
      })
    })
  })

  // obtener productos filtrados
  app.get('/productos/filtrado/:type', function(req , res) {
    ProductoSchema.find({}, 'name description code price type pic',
    (error , productos) => {
      if(error){ console.log(error) }
      var filtrado = []
      if (req.params.type == 'Todos' ){
        filtrado = productos
        res.send({filtrado})
      } else {
        for (var i = 0; i < productos.length; i++) {
          if ( productos[i].type === req.params.type ) {
              filtrado.push(productos[i])
          }
        }
        res.send({filtrado})
      }
    })
  })


  //obtener un solo producto
  app.get('/api/productos/:id', (req , res) => {
    ProductoSchema.findById(req.params.id,
      'name description code price type pic' , (error , producto) => {
        if (error) { console.error(error) }
        res.send(producto)
      })
  })
  //agregar nuevo producto
  app.post('/productos/add', (req, res) =>{
    const newProducto = new ProductoSchema({
      name: req.body.name,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      type: req.body.type,
      pic: req.body.pic
    })

    newProducto.save((error, producto) => {
      if (error){ console.log(error) }
      res.send(producto);
    })
  })

  // reseñar un producto
  app.post('/productos/rate/:id', (req, res) => {
    const rating = new Rating({
      producto_id: req.params.id,
      user_id: req.body.user_id,
      rate: req.body.rate
    })
    rating.save(function (error, rating) {
      if (error) { console.log(error) }
      res.send({
        producto_id: rating.producto_id,
        user_id: rating.user_id,
        rate: rating.rate
      })
    })
  })

   //obtener reseña de un producto
   app.get('/productos/rate/get/:id', function(req , res) {
    Rating.find({}, 'producto_id user_id rate',
    (error , ratings) => {
      var total = 0
      var reseñas = 0
      var promedio = 0
      if(error){ console.log(error) }
      for (var i = 0 ; i < ratings.length ; i++) {
        if (ratings[i].producto_id === req.params.id) {
          total += ratings[i].rate
          reseñas++
        }
      }
      promedio = total/reseñas
      res.send(promedio.toFixed())
    })
  })




  //eliminar un producto
  app.get('/productos/del/:id', (req , res) => {
    ProductoSchema.find({},
    (error , productos) => {
      if(error){ console.log(error) }
      for( i = 0 ; i < productos.length ; i++){
        if(productos[i]._id == req.params.id){
          productos[i].remove()     
        }
      }
       res.send(productos)
      })

  })

  //Actualizar un producto
  app.post('/productos/update', (req , res) => {    
    ProductoSchema.findById(req.body.id, (error , producto) => {
      if (error) { console.error(error) }     
    }).update({
      name: req.body.name,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      type: req.body.type,
      pic: req.body.pic
    })   
    res.send('Actualizado Correctamente')
  }) 

};
