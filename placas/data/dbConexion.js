require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

function buscador(){
    connection.query("SELECT * FROM tbplaca WHERE numPlaca = 18183", function(err, resultados){
        console.log(resultados);
        });

}

//creame una funcion llamada buscador?

connection.end()

