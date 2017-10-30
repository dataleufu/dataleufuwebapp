var fs = require("fs-extra");

//Copia archivos necesarios a aot
var resources = [
  'node_modules/core-js/client/shim.min.js',
  'node_modules/zone.js/dist/zone.min.js',
  'src/styles.css',
];
resources.map(function(f) {
  var path = f.split('/');
  var t = 'aot/' + path[path.length-1];
  fs.createReadStream(f).pipe(fs.createWriteStream(t));
});

var source = 'src/assets/'
var destination = 'aot/assets/'

// copy source folder to destination
fs.copy(source, destination, function (err) {
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('Directorio assets copiado')
});

fs.copy('src/index-aot.html', 'aot/index.html', function (err) {
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('Index copiado y renombrado')
});
