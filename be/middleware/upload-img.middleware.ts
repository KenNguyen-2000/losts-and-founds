import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('directory name: ', __dirname);
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const imgName = file.originalname;
    cb(null, `${Date.now()}-${imgName}`);
  },
});

const Data = multer({ storage: storage });
const uploadFiles = Data.array('files', 12);
export const uploadFilesMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadFiles(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(err);
    } else {
      next(err);
    }
  });
};
