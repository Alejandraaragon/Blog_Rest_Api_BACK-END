const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller.js');
const multer = require('multer');

//configuro donde se van a guardar mis imagenes
const almacenamiento = multer.diskStorage({//le debo indicar en que carpeta debo guardar todo mi archivo
    destination: function(req, file, cb) {//este metodo recibe una request, un file que es el archivo que se va a subir y el metodo cb --> es el que nos va a indicar donde queremos que sea el destino de subida de archivo. 
       cb(null, './imagenes/articles/')//Nos va a indicar donde esta el directorio. Primer parametro null y el segundo será el destino
    },

    filename: function(req, file, cb) {//este metodo es para conseguir el nombre que tendrá cada uno de esos archivos
       cb(null, 'article' + Date.now() + file.originalname)// le indicamos que queremos que el nombre del archivo empiece por article y queremos la fecha y el nombre del archivo original
    }
})

//Con lo anterior ya tenemos el almacenamiento configurado, ahora debemos decirle a multer que ese será el almacenamiento, que ahi van a ir los archivos
const uploaded = multer({storage: almacenamiento});


//Ruta de prueba
router.get('/ruta-de-prueba', articleController.prueba);

//Ruta que crea articulo
router.post('/create', articleController.create);

//Ruta que obtiene articulos
router.get('/articles', articleController.getArticles);

//Ruta que obtiene un articulo especifico
router.get('/article/:id', articleController.getArticleById);

//Ruta que obtiene un articulo especifico
router.delete('/article/:id', articleController.deleteArticle);

//Ruta para modificar un articulo especifico
router.put('/article/:id', articleController.editArticle);

//Ruta para subir archivos
router.post('/upload-file/:id', [uploaded.single("file0")], articleController.uploadFile); //[uploaded.single] single es porque solo subiré un archivo y el nombre de ese archi es "file0"

//Ruta imagen
router.get('/imagen/:fichero', articleController.imagen);


module.exports = router;
