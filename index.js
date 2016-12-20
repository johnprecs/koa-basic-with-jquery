'use strick'
let koa 		= require('koa'),
	app 		= koa(),
	router 		= require('koa-route'),
	fs			= require('co-fs'),
	parser   	= require('koa-body-parser'),
	lodash 		= require('lodash');		
	
let account = require('./db'); //external js (db connection and mongoose schema)
			
app.use(parser());	
			
app.use(router.get('/',function *(){
this.type = "text/html";
this.body = yield fs.readFile('index.html');
}));

app.use(router.post('/create',function *(){
let rtextfname = this.request.body.ptextfname;
let rtextlname = this.request.body.ptextlname;
let rtextemail = this.request.body.ptextemail;
let msg = "";
			
if (rtextfname == "" || rtextlname == "" || rtextemail == ""){
	msg = 'Somefields are empty';
}else{
let newaccout = new account ({
	fname: rtextfname,
	lname: rtextlname,
	email: rtextemail										
});
newaccout.save();
msg = "Successfully Registered";
}
this.body = msg;
}));

app.use(router.get('/view',function *(){
let allaccounts = yield account.find({}).exec();
let gfname = [];	
let glname = [];
let gemail = [];
		
lodash.each(allaccounts, (account) => {
	gfname.push(account.fname); 
	glname.push(account.lname); 
	gemail.push(account.email); 
});

//first name display +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++				
let dgfname = "<ul style='margin: 0 0 0 0;list-style-type: none;padding:0;position:absolute;'>";
	for (let i = 0; i < gfname.length; i++) {
		dgfname += "<li style='margin: 5px 0 0 0;width:180px;border:solid 1px black;text-align:center;'> " + gfname[i] + " </li>";
	}
dgfname += "</ul>";

//last name display ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++				
let dglname = "<ul style='margin: 0 0 0 0;list-style-type: none;padding:0;position:absolute;'>";
	for (let i = 0; i < glname.length; i++) {
		dglname += "<li style='margin: 5px 0 0 190px;border:solid 1px black;width:200px;text-align:center;'> " + glname[i] + " </li>";
	}
dglname += "</ul>";

//email display ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let dgemail = "<ul style='margin: 0 0 0 400px;list-style-type: none;padding:0;position:absolute;'>";
	for (let i = 0; i < gemail.length; i++) {
		dgemail += "<li style='margin: 5px 0 0 0;border:solid 1px black;width:250px;text-align:center;'> " + gemail[i] + " </li><input type='button' value='delete' style='margin: -20px 0 0 300px;position:absolute;' onclick='del(this)' name='"+gemail[i]+"'>";
	}
dgemail += "</ul>";
				
this.body = dgfname + " " + dglname + " " + dgemail +
"<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>"+
"<script>"+
	"function del(btn){"+
		"var getemail = btn.name;"+
			"$.post('/delete', {"+
				"pdelemail : getemail"+
				"},function(data){"+
					"alert(data);"+	
					"window.location.reload(true);"+	
				"});"+
	"}"+
"</script>";
}));

app.use(router.post('/delete',function *(){
let gdelemail = this.request.body.pdelemail;
let delaccount = yield account.remove({ email : gdelemail}).exec();
	this.body = "Successfully delete";
}));

app.use(router.post('/search',function *(){
let gsdata = this.request.body.psdata;
let searchaccounts = yield account.find({fname : gsdata}).exec();
	if (searchaccounts == ""){
		this.body = "No data found";
	}else{
		let gfname = [];	
		let glname = [];
		let gemail = [];
		
lodash.each(searchaccounts, (account) => {
	gfname.push(account.fname); 
	glname.push(account.lname); 
	gemail.push(account.email); 
});

//first name display +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++				
let dgfname = "<ul style='margin: 0 0 0 0;list-style-type: none;padding:0;position:absolute;'>";
	for (let i = 0; i < gfname.length; i++) {
		dgfname += "<li style='margin: 5px 0 0 0;width:180px;border:solid 1px black;text-align:center;'> " + gfname[i] + " </li>";
	}
dgfname += "</ul>";

//last name display ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++				
let dglname = "<ul style='margin: 0 0 0 0;list-style-type: none;padding:0;position:absolute;'>";
	for (let i = 0; i < glname.length; i++) {
		dglname += "<li style='margin: 5px 0 0 190px;border:solid 1px black;width:200px;text-align:center;'> " + glname[i] + " </li>";
	}
dglname += "</ul>";

//email display ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let dgemail = "<ul style='margin: 0 0 0 400px;list-style-type: none;padding:0;position:absolute;'>";
	for (let i = 0; i < gemail.length; i++) {
		dgemail += "<li style='margin: 5px 0 0 0;border:solid 1px black;width:250px;text-align:center;'> " + gemail[i] + " </li><input type='button' value='Delete' style='margin: -20px 0 0 300px;position:absolute;' onclick='del(this)' name='"+gemail[i]+"'>";
	}
dgemail += "</ul>";
				
this.body = dgfname + " " + dglname + " " + dgemail +
"<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>"+
"<script>"+
	"function del(btn){"+
		"let getemail = btn.name;"+
			"$.post('/delete', {"+
				"pdelemail : getemail"+
				"},function(data){"+
					"alert(data);"+	
					"window.location.reload(true);"+	
				"});"+
									
	"}"+
"</script>";
}
}));
	
app.use(router.get('/select',function *(){
let displayfname = yield account.find({}).exec();
let gdfname = [];	
		
lodash.each(displayfname, (account) => {
	gdfname.push(account.fname); 
});
this.body = gdfname;
}));

app.use(router.post('/edit',function *(){
let gselfname = this.request.body.pselfname;
let users = yield account.find({ fname : gselfname}).exec();
let dfname = [];
let dlname = [];
let demail = [];
				
lodash.each(users, (account) => {
	dfname.push(account.fname); 
	dlname.push(account.lname); 
	demail.push(account.email); 
});
this.body = {
	gwasfname : dfname,
	gwaslname : dlname,
	gwasemail : demail
};	
}));

app.use(router.post('/update',function *(){
let oldfname = this.request.body.pcfname;
let gufname = this.request.body.pufname;
let gulname = this.request.body.pulname;
let guemail = this.request.body.puemail;
		
let users = yield account.update(
	{ fname: oldfname },
		{$set: {
			fname: gufname,
			lname: gulname,
			email: guemail
			}
		}).exec();
this.body = "Successfully Updated";
}));

	app.listen(3000);