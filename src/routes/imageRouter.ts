import express, { Request, Response, NextFunction }  from 'express';

let router = express.Router();
let fs = require('fs');
let multer  = require('multer');

// multer storage config
const storage = multer.diskStorage({
  destination: function( req: any, file: any, cb: ( err: any, dest: string ) => void ){
    cb( null, './uploads' );
  },
  filename: function( req: any, file: any, cb: ( err: any, dest: string ) => void ){
    logger.debug('[Start]/upload_image filename: ', new Date().toISOString().slice(0, 10) + '_' + file.originalname);
    cb( null, new Date().toISOString().slice(0, 10) + '_' + file.originalname );
  }
});
const fileFilter = function (req: any, file: any, cb: ( err: any, next?: boolean ) => void) {
  logger.debug('[Start]/upload_image fileFilter');
  logger.debug('/upload_image file.mimetype: ', file.mimetype );
  if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
    cb(null, true);
  } else {
    logger.error('/upload_image fileFilter error: ');
    cb(new Error(`File upload only supports the following filetypes -  ${file.mimetype}`));
  }
}
// setup multer
var upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 10 } });
var singleUpload = upload.single('image');
var multiUpload = upload.array( 'images', 5 );
// Support log
var log4js = require('log4js');
// log4js configure
log4js.configure({
  appenders: { image_router: { type: 'file', filename: 'image_router.log' } },
  categories: { default: { appenders: ['image_router'], level: 'error' } }
});

var logger = log4js.getLogger('image_router'); 
logger.level = 'debug';

// GET LOG
router.get('/image_upload/log', (req: Request, res: Response) => {
  const URL: string = 'image_router.log' ;
  fs.readFile( URL, 'utf8', ( err: any, data: any ) : void => {
    if( err != null && err != undefined ){
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: `Cannot open log. Error is ${err}` 
        }
      });
    } else {
      res.writeHead( 200, {"Content-Type": "text/plain"});
      res.end(data);
    }
  })
})
// OPEN IMAGE
router.get('/open_image', (req: Request, res: Response) => {
  const URL: string = 'uploads/' + req.query.image_name;
  fs.readFile( URL, ( err: any, imageData: any ) : void => {
    if( err != null && err != undefined ){
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: `Cannot open image. Error is ${err}` 
        }
      });
      return;
    } else {
      res.writeHead( 200, { 'Content-Type': 'image/jpeg' });
      res.end(imageData);
    }
  })
})
// UPLOAD SINGLE IMAGE
router.post('/upload_image', ( req: { [index: string ] : any } ,res: Response, next: NextFunction ) => {
  logger.debug('[Start] upload_image single file upload');
  singleUpload( req, res, ( err: any ) => {
    logger.debug('/upload_image file data: ', req.file);
    if( err != null || err != undefined ){
      logger.error('/upload_image error: ', err.toString());
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: err.toString()
        }
      });
    } else if ( req.file == null || req.file == undefined ){
      logger.error('/upload_image error: req.file == null || req.file == undefined');
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: "No image to upload"
        }
      });
    } else {
      // Upload images successfully
      logger.debug('/upload_image Upload image successfully');
      res.status(201).json({
        resultInfo: 'Ack',
        result: {
          data: req.file.filename,
          numberOfImages: 1,
          message: "Upload images successfully"
        }
      })
    }
    
  });
})
// UPLOAD MULTIPLE  IMAGE
router.post('/upload_images', ( req: { [index: string ] : any } ,res: Response, next: NextFunction ) => {
  logger.debug('[Start] upload_images multiple files upload');
  multiUpload( req, res, ( err: any ) => {
    logger.debug('/upload_images array file data: ', req.files);
    if( err != null || err != undefined ){
      logger.error('/upload_image error: ', err.toString());
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: err.toString()
        }
      });
    } else if ( req.files == null || req.files == undefined || req.files.length == 0 ){
      logger.error('/upload_image error: req.files.length == 0');
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: "No image to upload"
        }
      });
    } else {
      // Upload images successfully
      logger.debug('/upload_images Upload images successfully');
      res.status(201).json({
        resultInfo: 'Ack',
        result: {
          data: req.files.map((x: any) => x.filename ),
          numberOfImages: req.files.length,
          message: "Upload images successfully"
        }
      })
    }
  });
})

export default router;