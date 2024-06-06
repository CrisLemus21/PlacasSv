const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbplacas'
})

connection.connect(
(err)=>{
    if (err){
        console.log("Conexion establecida");
    }
    
    else{
        console.log("No se pudo conectar")
    }
});
function buscador(){
    connection.query("SELECT * FROM tbplaca WHERE numPlaca = 18183", function(err, resultados){
        console.log(resultados);
        });

}

//creame una funcion llamada buscador?

connection.end()

