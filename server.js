var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoose_DB');

// Use native promises
mongoose.Promise = global.Promise;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var MongooseSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2 },
    favorite_color: {type: String, required: true, minlength: 2}
    }, {timestamps: true})
mongoose.model('Mongoose', MongooseSchema);
var Mongoose = mongoose.model('Mongoose');


app.get('/', function(req, res) {
    arr = Mongoose.find({}, function(err, mongooses) {
        res.render('index', {arr:mongooses});
    })
})
app.get('/mongooses/new', function(req, res) {
    res.render('new');
})

app.post('/add', function(req, res) {
  console.log("POST DATA", req.body);
  var mongoose = new Mongoose({name: req.body.name, favorite_color: req.body.favorite_color});
  mongoose.save(function(err) {
    if(err) {
      console.log('something went wrong');
      console.log(mongoose.errors);
      res.redirect('/')
    }
    else {
      console.log('successfully added a Mongoose!');
      res.redirect('/');
    }
  })
})

app.get('/mongooses/edit/:id', function(req, res) {
    meer = Mongoose.findOne({_id: req.params.id}, function(err, mongoose) {
        console.log(mongoose);
        res.render('edit', {meer:mongoose});
    })
})
app.post('/change/:id', function(req, res) {
    console.log("POST DATA", req.body);
    Mongoose.update({_id: req.params.id},
                    {name: req.body.name,
                    favorite_color: req.body.favorite_color},
                    function(err){
                        if(err) {
                            console.log('something went wrong');
                            console.log(mongoose.errors);
                            res.redirect(`/mongooses/edit/${req.params.id}`)
                        }
                        else {
                            console.log('successfully changed a Mongoose!');
                            res.redirect(`/mongooses/${req.params.id}`);
                        }

    })
})
app.post('/delete/:id', function(req,res){
    Mongoose.remove({_id: req.params.id}, function(err){
        console.log("RECORD DELETED");
        res.redirect('/');
    })
})
app.get('/mongooses/:id', function(req, res) {
    meer = Mongoose.findOne({_id: req.params.id}, function(err, mongoose) {
        console.log(mongoose);
        res.render('mongoose', {meer:mongoose});
    })
});

  // Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});
