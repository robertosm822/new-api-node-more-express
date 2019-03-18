const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const User = require('../models/User');

//importanto o hash da aplicação
const authConfig = require('../../config/auth');

const router = express.Router();

	function generateToken(params = {})
	{
			return jwt.sign(params, authConfig.secret,{ expiresIn: 86400 });
	}

router.post('/register', async(req, res) =>{
	//tratar email repetido
	const { email } = req.body;
	
	
	try{
		if(await User.findOne({ email }))
			return res.status(400).send({ error: 'Usurio existente...' });
		
		const user = User.create(req.body);
		
		//limpando da visualizacao do json a senha, por seguranca
		user.password = undefined;
		
		return res.send({ 
			user,
			token: generateToken({ id: user.id }),			
		});
	} catch(err){
		return res.status(400).send({ error: 'Registration failed' });
	}
});

router.post('/authenticate', async (req, res) =>
{	
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select('+password'); 
	
	if(!user)
		return res.status(400).send({ error: 'Usuário inexistente' });
	
	if(!await bcrypt.compare(password, user.password))
		return res.status(400).send({ error: 'Invalid password' });
	
	//limpando da visualizacao do json a senha, por seguranca
	user.password = undefined;
	
	
	res.send({ 
		user, 
		token: generateToken({ id: user.id }), 
	});
	
});

router.post('/forgot_password', async (req, res) => {
	const { email } = req.body;
	
	try{
		const user = await User.findOne({ email });
		
		if(!user)
			return res.status(400).send({ error: 'User not found' });
		
		const token = crypto.randomBytes(20).toString('hex');
		//tempo de expiracao do token
		const now = new Date();
		now.setHours(now.getHours() + 1);
		
		//salvar o token na tabela User
		await User.findOneAndUpdate(user.id, {
			'$set': {
				passwordResetToken: token,
				passwordResetExpires: now,
			}
		});	
		/*
			CONTINUAR NO VIDEO #3: https://www.youtube.com/watch?v=Zwdv9RllPqU&index=3&list=PL85ITvJ7FLoiXVwHXeOsOuVppGbBzo2dp
			AOS 21:30 MINUTOS
		*/
		mailer.sendMail({
			to: email,
			from: 'ed39c1c750-1d4d93@inbox.mailtrap.io',
			template: 'auth/forgot_password',
			context: { token }			
		}, (err) => {
			if(err)
				return res.status(400).send({ error: 'Cannot send forgot password email: '+err });
			
			return res.send();
		});
		
	}catch(err){
		res.status(400).send({ error: 'Error on forgot password, try again: '+err });
	}
});

module.exports = app => app.use('/auth', router);