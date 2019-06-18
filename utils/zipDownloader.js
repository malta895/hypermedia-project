const { Curl, CurlFeature } = require('node-libcurl');

const curl = new Curl(),
      fs = require('fs');

const headers = [
    `Authorization: token ${process.env.GITHUB_TOKEN}`,
    "Accept: application/vnd.github.v3.raw"
];

exports.downloadRepoZip = function dowloadRepoZip () {

    return new Promise(function (resolve, reject) {
        curl.setOpt('URL', process.env.GITHUB_URL);
        curl.setOpt('FOLLOWLOCATION', true);
        curl.setOpt('HTTPHEADER', headers);

        try{
            fs.truncateSync('app.zip');
        }catch(e){
            console.error(e);
        }

        const fileOut = fs.openSync('app.zip', 'w+');

        curl.setOpt('WRITEFUNCTION', (buff, nmemb, size) => {
            let written = 0;

            if(fileOut) {
                written = fs.writeSync(fileOut, buff, 0, nmemb * size);
            } else {
                console.log('invalid file!');
                throw Error("File doesn't exist!");
            }
            return written;
        });

        curl.enable(CurlFeature.Raw | CurlFeature.NoStorage);

        curl.on('end', function (statusCode, data, headers) {
            console.info('File app.zip downloaded in ' + this.getInfo('TOTAL_TIME') +
                         ' seconds.');
            fs.closeSync(fileOut);
            curl.close();
            resolve();
        });

        curl.on('error', err => {
            console.error(err);
            reject(err);
            fs.closeSync(fileOut);
            curl.close();
        });

        console.log("DOWNLOADING ZIP REPO...");
        curl.perform();
    });
};
