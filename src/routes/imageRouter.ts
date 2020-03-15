import express, { Request, Response, NextFunction }  from 'express';

let router = express.Router();
let formidable = require('formidable');
let fs = require('fs');

router.get('/test', (req: Request, res: Response) => {
  res.send('hello');
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

// UPLOAD IMAGE
router.post('/upload_images', (req: Request ,res: Response, next: NextFunction ) => {
  const options = {
    uploadDir: 'uploads',
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20MB
    multiples: true
  }
  let form = formidable(options);
  form.parse( req, ( err: any, fields: any, files: any ): void => {
    if( err != null ){
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: `Cannot upload image. Error is ${err}` 
        }
      });
      return;
    }
    let file: any = files[""];
    if( file.length > 0 ){
      let fileNames: string[] = [];
      file.forEach(( eachFile : { [index: string]:any }) : void => {
        fileNames.push(eachFile["path"]);
      });
      res.status(201).json({
        resultInfo: 'Ack',
        result: {
          data: fileNames,
          numberOfImages: fileNames.length,
          message: "Upload images successfully"
        }
      })
    } else if( file.type.includes('image') && file.size > 0 ){
      res.status(201).json({
        resultInfo: 'Ack',
        result: {
          data: file.path,
          numberOfImages: 1,
          message: "Upload images successfully"
        }
      })
    } else {
      res.status(404).json({
        resultInfo: 'Nack',
        result: {
          message: "No images to upload"
        }
      })
    }
  })
});

export default router;