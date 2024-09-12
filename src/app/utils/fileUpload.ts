import multer from 'multer';
import path from 'path';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
import fs from 'fs';

export interface IFile {
  fieldname: string;
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// multer configurations
export const upload = multer({
  dest: path.join(process.cwd(), './uploads'),
});

// cloudinary configurations
cloudinary.config({
  api_key: config.cloud.cloud_api,
  api_secret: config.cloud.cloud_secret,
  cloud_name: config.cloud.cloud_name,
});

export const uploadToCloud = async (
  file: IFile,
  id: string,
  folderName: string = '',
): Promise<UploadApiResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await cloudinary.uploader.upload(file.path, {
        folder: `${config.app_name}/${folderName}`,
        public_id: id,
      });
      resolve(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      reject(error);
    }
    await fs.unlink(file.path, () => {
      // eslint-disable-next-line no-console
      console.log('File Delete Success...');
    });
  });
};
