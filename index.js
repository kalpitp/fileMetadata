var express = require('express');
var app = express();
var multer = require('multer')
var bodyParser = require('body-parser');
var fs = require('fs');
const path = require('path');

var upload = multer({
  dest: 'uploads/'
})




// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;




// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

var temp_folder_path = path.join(__dirname, 'uploads');


var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads')
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now())
  }

})

var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
             if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                fs.rmdirSync(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }
};


app.get(['/', '/about'], function(req, res) {
  // ejs render automatically looks in the views folder

  res.render('index');
});


app.post('/upload', function(req, res) {
  deleteFolderRecursive (temp_folder_path)

      var fileSize;

      var upload = multer({
        storage: storage
      }).single('userFile')
      upload(req, res, function(err) {

          fs.stat(req.file.path, function(err, stats) {
              fileSize= {"size": stats["size"]}


              res.writeHead(200, {
                'Content-Type': 'application/json'
              }); res.end(JSON.stringify(fileSize));

          })



      })
  })

    app.listen(port, function() {
      console.log('Our app is running on http://localhost:' + port);
    });
