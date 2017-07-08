var express = require('express'),
    app = express(),
    port = process.env.PORT || 8000;
var fileUpload = require('express-fileupload');

app.use(express.static('public'));
app.use(fileUpload({
    limits: {
        // 2MB file size limit
        fileSize: 2 * 1024 * 1024
    },
}));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.post('/upload', function (req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "fileName") is used to retrieve the uploaded file 
    var file = req.files.fileName,
        name = file.name;
    //console.log(req.files.fileName.name);
    //console.log(file);    
    // Use the mv() method to place the file somewhere on your server 
    file.mv('./public/uploads/' + name, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });
});

// Return 404 on missing pages
app.get('*', function (req, res) {
    res.status(404).send('Error: 404. Page not found !');
});

// Error handler
app.use(function (err, req, res, next) {
    // if URIError occurs
    if (err instanceof URIError) {
        err.message = 'Failed to decode param at: ' + req.url;
        err.status = err.statusCode = 400;
        return res.send('Error: ' + err.status + '<br>' + err.message);
    } else {
        // TODO: More errors...
    }
    next();
});

app.listen(port, console.log('Listening on port:', port));
