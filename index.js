const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/api_db', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true)

let db = mongoose.connection;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let user = new mongoose.Schema({
 nombre:{
	 type: String,
	 required: true,
 },
 apellido:{
	 type: String,
	 required: true,
 }
});
let usuario = mongoose.model("usuario", user);

let respuesta = {
	error: false,
	codigo: 200,
	mensaje: ''
};

app.get('/',(req, res) => {
	respuesta = {
		error: true,
		codigo: 200,
		mensaje: 'Punto de inicio'
	};
	res.send(respuesta);
});

app.get('/usuario', (req, res) =>  {
	usuario.find(function (err, doc) {
		res.send(doc);
	})
});

	app.post('/usuario',(req, res) => {
		var myData = new usuario(req.body);
		myData.save()
		.then(item => {
			res.send("Usuario salvado!");
		})
		.catch(err => {
			res.status(400).send("No se pudo salvar el usuario");
		});
	});
	
		
	app.put('/usuario',(req,res) => {
		var values = req.body;
		var user_id = req.params.user_id;
		usuario.update({user_id: user_id},
			values, (err,values) => {
				if (!err) {
					res.json('Usuario Actualizado!!!');
				}else{
					res.write('fallo.....');
				}
			});
	});
				
	
app.delete('/usuario',(req,res) => {
	var id = req.param.id;
	usuario.deleteOne({
		_id: id
	}, (err) => {
		if (err) {
			console.log(err)
		} else {
			return res.send('Usuario eliminado');
		}
	});
});


app.use(function(req, res, next) {
	respuesta = {
		error: true,
		codigo: 404,
		mensaje: 'URL no encontrada'
	};
	res.status(404).send(respuesta);
});

app.listen(3000, () => {
	console.log("El servidor esta inicializado en el puerto 3000");
});

