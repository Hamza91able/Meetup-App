const functions = require("firebase-functions");
const os = require("os");
const path = require("path");
const cors = require("cors")({ origin: true });
const Busboy = require("busboy");
const fs = require("fs");

const gcconfig = {
    projectId: 'meet-up-app-a64cb',
    keyFilename: 'meet-up-app-a64cb-firebase-adminsdk-ln6jr-35638dd1e4.json'
};

const gcs = require('@google-cloud/storage')(gcconfig);

const UUID = 'd2b8a384-eddb-42a2-9f13-d8f4b1b65d1d'

exports.uploadImage = functions.https.onRequest((req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    cors(req, res, () => {
        if (req.method !== "POST") {
            // res.set('Access-Control-Allow-Origin', '*');
            // return res.status(500).json({
            //     message: "Not allowed"
            // });
            res.set('Access-Control-Allow-Origin', 'http://localhost:3000/')
                .set('Access-Control-Allow-Methods', 'GET, POST')
                .status(200);
            return;
        }
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = { file: filepath, type: mimetype };
            file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on("finish", () => {
            const bucket = gcs.bucket("meet-up-app-a64cb.appspot.com");
            bucket
                .upload(uploadData.file, {
                    uploadType: "media",
                    metadata: {
                        metadata: {
                            contentType: uploadData.type
                        }
                    }
                })
                .then((data) => {
                    let file = data[0];
                    res.status(200).json({
                        message: "It worked!",
                        link: "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + UUID
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
        busboy.end(req.rawBody);
    });
});