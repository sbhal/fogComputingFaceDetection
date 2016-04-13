cv = require('opencv');
PythonShell = require('python-shell');
var im;
cv.readImage('test.jpg', function(err, mat) {
    console.log(mat.toBuffer());

    //var buffer = new Buffer(mat, base64);

    console.log(new Buffer("Hello World").toString('base64'));
    console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'));
    console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64'));
});
var output = '';
console.log('----------Python----------');
var pyshell = new PythonShell('test.py', {
    args: ['hello', 'world'],
    mode: 'binary'
});

pyshell.send("Siddharth");

pyshell.on('message', function(message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log("--->", message);
});
pyshell.stdout.on('data', function(data) {
    output += '' + data;
});

pyshell.end(function(err) {
    if (err) throw err;
    console.log("Output is", output);
    console.log('----------Invoking script again----------');

    PythonShell.run('test.py', {
        args: ['hello', 'world'],
        mode: 'binary'
    }, function(err, results) {
        output += results;
        console.log('--some--');
    });
});
setTimeout(function() {
    console.log(output);
    console.log("\n");
}, 3000);

