const ImageKit = require('imagekit');
const slugify = require('slugify');

module.exports = {
  provider: 'imagekit',
  init: providerOptions => {
    const urlEndpoint = `https://ik.imagekit.io/${providerOptions.id}/`;
    const imagekit = new ImageKit({
      urlEndpoint,
      publicKey: providerOptions.publicKey,
      privateKey: providerOptions.privateKey
    });
    const imageRoot = `/${providerOptions.imageRoot || ''}/`.replace(/\/\/?\/?/g, '/');
    
    const getFileName = file => {
      if(typeof file.name === 'undefined') {
        return file.hash.toLowerCase() + file.ext.toLowerCase();
      }
      return slugify(file.name.toLowerCase()) + file.ext.toLowerCase();
    };

    const getFilePath = file => {
      const current = new Date();
      const metadata = {
        year: current.getFullYear(),
        month: `0${current.getMonth() + 1}`.slice(-2),
        day: `0${current.getDate()}`.slice(-2)
      };

      let filePath = providerOptions.pathTemplate;
      filePath = filePath.replace(/%\(year\)/g, metadata.year);
      filePath = filePath.replace(/%\(month\)/g, metadata.month);
      filePath = filePath.replace(/%\(day\)/g, metadata.day);


      return `${imageRoot}${filePath}/`.replace(/\/\/?\/?/g, '/');
    };

    const _upload = file => {
      const filePath = getFilePath(file);      
      return new Promise((resolve, reject) => {
        imagekit.upload({
          file: Buffer.from(file.buffer, 'binary').toString('base64'),
          fileName: getFileName(file),
          folder: filePath
        })
          .then(r => {
            strapi.log.info(`File uploaded to ${r.url}`);
            file.url = r.url,
            file.provider_metadata = r;
            return resolve();
          }, e => {
            strapi.log.error('Error uploading file', e);
            return reject();
          });
      });
    };
    const _delete = file => {
      return new Promise((resolve, reject) => {
        imagekit.deleteFile(file.provider_metadata.fileId)
          .then(r => {
            strapi.log.info(`Deleted file ${file.provider_metadata.fileId} at ${file.provider_metadata.url}`);
            return resolve();
          }, e => {
            strapi.log.error(`Unable to delete file ${file.provider_metadata.fileId}`, e);
            return reject();
          })
      });
    };
    return {
      upload: _upload,
      delete: _delete
    };
  }
};