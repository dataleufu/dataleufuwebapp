var fs = require("fs-extra");

fs.copy('src/app/config-production.ts', 'src/app/config.ts', function (err) {
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('config-production.ts copiado y renombrado')
});
