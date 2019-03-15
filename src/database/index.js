const mongoose = require('mongoose');

//setando o banco de dados
mongoose.connect('mongodb://localhost/noderest01', { useNewUrlParser: true });
//mongoose.connect('mongodb+srv://strarWars:78Rest65@cluster0-rtnuj.mongodb.net/noderest01?retryWrites=true', { useNewUrlParser: true })
mongoose.Promise = global.Promise;

module.exports = mongoose;