const validator = require('validator');
const Article = require('../models/Article.js');
const fs = require('fs');
const path = require('path')

const prueba = (req, res) => {
    
    return res.status(200).json({
        mensaje: "Soy una accion de prueba"
    });
}

const create = async (req, res) => {
    
    let params = req.body;

    try {
        let validate_title = !validator.isEmpty(params.title) &&
                              validator.isLength(params.title, {min: 5, max: 15});
        let validate_content = !validator.isEmpty(params.content);

        if(!validate_title || !validate_content) {
            throw new Error("No se ha validado la informacion")
        }
        
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

     const article = new Article(params);
     try {
        const articleSaved = await Article.create(article);
        
        return res.status(200).json({
            status: "success",
            article: articleSaved,
            mensaje: "Artículo creado"
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el artículo"
        });
    }
}

const getArticles = async (req, res) => {

    try {
      const articles = await Article.find({}).sort({date: -1}).exec();

      if (!articles) {
        return res.status(400).json({
          status: "error",
          mensaje: "No se ha encontrado artículo"
        });
      }
      
      return res.status(200).json({
        status: "success",
        contador: articles.length,
        articles,
      });

    } catch (error) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error en la consulta de artículos"
      });
    }
  };

const getArticleById = async (req, res) => {

    let id = req.params.id;

    try {
        const article = await Article.findById(id);

        if (!article) {
            return res.status(400).json({
              status: "error",
              mensaje: "No se ha encontrado el artículo"
            });
          }
          
          return res.status(200).json({
            status: "success",
            article,
          });

    } catch (error) {
        return res.status(500).json({
        status: "error",
        mensaje: "Error, no existe el articulo buscado por ese id"
      });
    }
}

const deleteArticle = async (req, res) => {
    let id = req.params.id;

    try {
        const article = await Article.findOneAndDelete(id);

        if (!article) {
            return res.status(400).json({
              status: "error",
              mensaje: "No se ha encontrado el artículo"
            });
          }
          
          return res.status(200).json({
            status: "success",
            article,
          });

    } catch (error) {
        return res.status(500).json({
        status: "error",
        mensaje: "Error, no existe el articulo buscado por ese id"
      });
    }
}

const editArticle = async (req, res) => {
    
    let articleId = req.params.id;

    let {title, content, image, date} = req.body;

    try {
        let validate_title = !validator.isEmpty(title) &&
                              validator.isLength(title, {min: 5, max: 15});
        let validate_content = !validator.isEmpty(content);

        if(!validate_title || !validate_content) {
            throw new Error("No se ha validado la informacion")
        }
        
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    try {
        
        const updatedArticle = await Article.findOneAndUpdate(
                             {_id: articleId}, 
                             {title, content, image, date}, 
                             { new: true }
        );
        if (!updatedArticle) {
            return res.status(404).json({
              status: "error",
              mensaje: "No se encontró el artículo"
            });
          }
      
          return res.status(200).json({
            status: "success",
            article: updatedArticle
          });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el artículo"
          });

    }
       

}

const uploadFile = async (req, res) => {
    //recoger el fichero de imagen subido. Validamos que se envie algo
    if(!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            mensaje: "Peticion invalida"
        });
    }
    //Nombre del archivo
    let archivo = req.file.originalname;

    //Extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    //comprobar si la extension en correcta
    if(extension !== "png" && extension !== "jpg" &&
       extension !== "jpeg" && extension !== "gif") {

    //Borra el archivo. Si no tiene ninguna de las extensiones anteriores
     fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Imagen invalida"
    });
  })

    }else {
        let articleId = req.params.id;
      
            const updatedArticle = await Article.findOneAndUpdate(
                                 {_id: articleId}, 
                                 {image: req.file.filename}, 
                                 { new: true }
            );
            if (!updatedArticle) {
                return res.status(500).json({
                  status: "error",
                  mensaje: "Error al actualizar"
                });
              }
          
              return res.status(200).json({
                status: "success",
                article: updatedArticle,
                fichero: req.file
              });
 }
}

const imagen = (req, res) => {
  let fichero = req.params.fichero;//recibe un fichero de los parametros
  let ruta_fisica = "./imagenes/articles"+ fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if(existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    }else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        existe,
        fichero,
        ruta_fisica
      })
    }
  })
}


module.exports = {
    prueba,
    create,
    getArticles,
    getArticleById,
    deleteArticle,
    editArticle,
    uploadFile,
    imagen
}

