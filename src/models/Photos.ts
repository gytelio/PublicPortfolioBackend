import fileUpload from "express-fileupload";
import { cloud } from "../app";
import { UploadApiResponse } from "cloudinary";
import { IPhoto } from "../interfaces/Photos";
import { databasePool } from "../app";
import { RowDataPacket } from "mysql2";

export const savePhoto = async (files: fileUpload.UploadedFile | fileUpload.UploadedFile[], main_index: number | null): Promise<IPhoto[] | undefined> => {
  try {
    const fileArray = Array.isArray(files) ? files : [files];
    const promises: Promise<UploadApiResponse>[] = [];
    for (const file of fileArray) {
      if (!file.tempFilePath) {
        throw new Error("File malformed, no file path");
      }
      promises.push(cloud.uploader.upload(file.tempFilePath));
    }
    const uploadedFiles = await Promise.all(promises);
    const sqlPromises = [];
    for (const uploadedFile of uploadedFiles) {
      let sql = `INSERT INTO gallery (public_id, url) VALUES ('${uploadedFile.public_id}', '${uploadedFile.url}')`;
      if (main_index) {
        sql = `INSERT INTO gallery (public_id, url, main_index) VALUES ('${uploadedFile.public_id}', '${uploadedFile.url}', '${main_index}')`;
      }
      sqlPromises.push(databasePool.execute(sql));
    }
    await Promise.all(sqlPromises);
    return uploadedFiles.map(el => ({
      public_id: el.public_id,
      url: el.url,
      main_index,
    }));
  } catch (err) {
    console.log(JSON.stringify(err));
    return undefined;
  }
};

export const updatePhoto = async (file: fileUpload.UploadedFile, public_id: string): Promise<IPhoto | undefined> => {
  try {
    const uploadedFile: UploadApiResponse = await cloud.uploader.upload(file.tempFilePath, {
      public_id,
    });
    const sql = `UPDATE gallery SET url = '${uploadedFile.url}' WHERE public_id = '${public_id}'`;
    await databasePool.execute(sql);
    return {
      public_id: uploadedFile.public_id,
      url: uploadedFile.url,
      main_index: uploadedFile.main_index,
    };
  } catch (err) {
    return undefined;
  }
};

export const deletePhoto = async (public_id: string): Promise<void> => {
  try {
    await cloud.uploader.destroy(public_id);
    const sql = `DELETE FROM gallery WHERE public_id = '${public_id}'`;
    await databasePool.execute(sql);
    console.log(`Succesfully deleted file ${public_id}`);
  } catch (err) {
    console.log(`Failed to delete file ${public_id}`);
  }
};

export const getPhotos = async (): Promise<IPhoto[] | undefined> => {
  try {
    const sql = "SELECT public_id, url, main_index FROM gallery";
    const [results] = await databasePool.execute(sql);
    const rows = results as RowDataPacket[];
    const photos: IPhoto[] = rows.map(row => ({
      public_id: row.public_id,
      url: row.url,
      main_index: row.main_index,
    }));

    return photos;
  } catch (err) {
    return undefined;
  }
};

