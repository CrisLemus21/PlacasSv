const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');




const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbplacas'
});

//----------------------------------------------------------------------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  if (req.query.buscar) {
    var id = req.query.buscar;
    connection.query('SELECT * FROM tbplaca WHERE numPlaca = ?', [id], function(err, resultados) {


      if (!err && resultados.length > 0) {
        res.render('resultados', { title: 'Resultados de la búsqueda', data: resultados });
      } else {
        res.render('datanull', { title: '' });
      }


    });

  } else {
    console.log("incorrecto");
    res.render('index', { title: 'ENCUENTRA TU PLACA SV' });
  }
});



//----------------------------------------------------------------------------------------------------------------------------------------

router.get('/publicar', function(req, res, next) {
  res.render('publicar', { title: 'publicaciones' });

});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Configura el directorio de subida
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
router.post('/publicar', upload.single('image'), (req, res) => {
  const { placa, ubicacion, Fecha, Contacto } = req.body;
  const img = req.file ? req.file.filename : null;
  
  const CHECK_QUERY = `SELECT * FROM tbplaca WHERE numPlaca = ?`;
  const INSERT_QUERY = `INSERT INTO tbplaca (numPlaca, ubicacion, Fecha, Contacto, imagen) VALUES (?, ?, ?, ?, ?)`;

  connection.query(CHECK_QUERY, [placa], (error, results, fields) => {
    if (error) {
      console.error('Error al verificar la placa en la base de datos:', error);
      if (img) {
        fs.unlink(`uploads/${img}`, (err) => {
          if (err) {
            console.error('Error al eliminar la imagen:', err);
          }
        });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    
    if (results.length > 0) {
      if (img) {
        fs.unlink(`uploads/${img}`, (err) => {
          if (err) {
            console.error('Error al eliminar la imagen:', err);
          }
        });
      }
      res.status(400).json({ error: 'Esta placa ya fue publicada.' });
    } else {
      connection.query(INSERT_QUERY, [placa, ubicacion, Fecha, Contacto, img], (error, results, fields) => {
        if (error) {
          console.error('Error al insertar datos en la base de datos:', error);
          if (img) {
            fs.unlink(`uploads/${img}`, (err) => {
              if (err) {
                console.error('Error al eliminar la imagen:', err);
              }
            });
          }
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
        }
        console.log('Datos insertados correctamente');
        res.status(200).json({ success: true });
      });
    }
  });
});



//----------------------------------------------------------------------------------------------------------------------------------------


router.get('/datanull', function(req, res, next) {
  res.render('datanull', { title: '' });
});
//----------------------------------------------------------------------------------------------------------------------------------------

router.get('/layout', function(req, res, next) {
  res.render('layout', { title: '' });
});

//----------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;
