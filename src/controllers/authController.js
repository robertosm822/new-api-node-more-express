const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async(req, res) =>{
	//tratar email repetido
	const { email } = req.body;
	
	
	try{
		if(await User.findOne({ email }))
			return res.status(400).send({ error: 'Usurio existente...' });
		
		const user = User.create(req.body);
		
		//limpando da visualizacao do json a senha, por seguranca
		user.password = undefined;
		
		return res.send({ user });
	} catch(err){
		return res.status(400).send({ error: 'Registration failed' });
	}
});

module.exports = app => app.use('/auth', router);