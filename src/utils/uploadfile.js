const fs = require('fs')
const shortid = require('shortid')
const path = require('path')

exports.storeFS = ({ stream, filename }) => {
    const id = shortid.generate()
    const path_picture = path.join(__dirname, `../pictures/${id}-${filename}`)
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                    // delete the truncated file
                    fs.unlinkSync(path_picture);
                reject(error);
            })
            .pipe(fs.createWriteStream(path_picture))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ path_picture }))
    );
}
