var mongoose 	= require('mongoose');

	mongoose.connect('mongodb://localhost/paulfox');
		var db  = mongoose.connection;
			db.on('error', function(err){
				console.log('field to connect', err);
			});
			db.once('open', function(){
				console.log('connected');
			});
			
		var Schema = mongoose.Schema;
		var accountSchema = new Schema({
			fname: String,
			lname: String,
			email: String
		});
		var account = mongoose.model('account', accountSchema);
		
		module.exports = account;