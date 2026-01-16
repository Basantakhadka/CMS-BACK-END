import { ObjectStorage } from "./object_storage";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileRequestBodyType } from "./request_body_type";
import { Stream } from "stream";
const Minio = require("minio");

export interface getDownloadableUrlWithMIMEInterface { 
  url: string; 
  contentType: string; 
}

@Injectable()
export class MinioClientProvider implements ObjectStorage, OnModuleInit {
  constructor(private configService: ConfigService) {}
  minioClient: any;
  onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  private bucketName = process.env.MINIO_BUCKET_NAME; //this.configService.get<string>('minio.bucket_name')
  private expiryTime: number = 60 * 60;

  async getUploadableUrl(
    objectId: string,
    bucketName?: string,
    expiryTime?: number
  ): Promise<string> {
    try {
      const url = await this.minioClient.presignedPutObject(
          bucketName || this.bucketName,
        objectId,
          expiryTime || this.expiryTime
      );
      return url;
    } catch (error) {
      console.log("MINIO ERROR !!!!!!!!",error.message);
      return error;
    }
  }

  async getDownloadableUrl(objectId: string) {
    try {
      if (objectId !== null) {
        return await this.minioClient.presignedGetObject(
          this.bucketName,
          objectId
        );
      }
      return null;
    } catch (error) {
      return error;
    }
  }

async getDownloadableUrlWithMIME(objectId: string): Promise<getDownloadableUrlWithMIMEInterface> {
  try {
        if (objectId !== null) {
          // Get the file's metadata
          const metadata = await this.minioClient.statObject(this.bucketName, objectId);
  
          // Get the presigned URL
          const presignedUrl = await this.minioClient.presignedGetObject(
            this.bucketName,
            objectId
          );

          return {
            url: presignedUrl,
            contentType: metadata.metaData['content-type'] || 'application/octet-stream' // Default if no content-type
          };
        }
      return null;
    } catch (error) {
      return error;
  }
}
  async getUrlFromObjectIds(objectArr: Array<string>) {
    try {
      var images = [];
      for (let i = 0; i < objectArr.length; i++) {
        const img_url = await this.getDownloadableUrl(objectArr[i]);
        images[i] = img_url;
      }
      return images;
    } catch (error) {
      return error;
    }
  }
  async getUrlInObject(param: object): Promise<object> {
    try {
      for (let key in param) {
        if (param.hasOwnProperty(key) && typeof param[key] === "string") {
          param[key] = await this.getDownloadableUrl(param[key]);
        }
      }
      return param;
    } catch (err) {
      throw err;
    }
  }

  async getObjectEtag(objectId: string, bucketName?: string) {
    try {
      const stat = await this.minioClient.statObject(
        bucketName ? bucketName : this.bucketName,
        objectId
      );
      return stat.etag;
    } catch (error) {}
  }
  async checkEtag(objectId: string, etag: string) {
    try {
      const objEtag = await this.getObjectEtag(objectId);
      if (objEtag !== etag) {
        return false;
      }
      return true;
    } catch (error) {
      return error;
    }
  }
  async checkEtagInArray(params: FileRequestBodyType[]) {
    try {
      let imgObjects = [];
      for (var i = 0; i < params.length; i++) {
        var obj = params[i];
        var checkEtag = await this.checkEtag(obj.objectId, obj.etag);
        if (checkEtag === true) {
          imgObjects.push(obj.objectId);
        }
        if (checkEtag === false) {
          break;
        }
      }
      if (params.length === imgObjects.length) {
        return imgObjects;
      } else {
        return null;
      }
    } catch (err) {
      return { ...err, objectId: obj.objectId, etag: obj.etag };
    }
  }

  async getStoredObjectArray(
    params: FileRequestBodyType[],
    subFolder?: string
  ): Promise<string[]> {
    try {
      const checkObjExists: Array<string> = await this.checkEtagInArray(params);
      if (subFolder) {
        const result = checkObjExists.map((data) => {
          return subFolder + "/" + data;
        });
        return result;
      }
      return checkObjExists;
    } catch (error) {
      return error;
    }
  }


  async checkEtagInRequestObject(request: object): Promise<boolean> {
    const isObject = (obj) => {
      return typeof obj === "object" && obj !== null && !Array.isArray(obj);
    };
    try {
      const files = Object.values(request);
      const filteredArray = files.filter((data) => isObject(data) === true);
      for (let i in filteredArray) {
        const objectId = filteredArray[i].objectId;
        const etag = filteredArray[i].etag;
        const imageExists = await this.checkEtag(objectId, etag);
        if (imageExists === false) {
          return false;
        }
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async getObject(objectId: string, filePath: string, bucketName?: string) {
    try {
      await this.minioClient.fGetObject(
        bucketName ? bucketName : this.bucketName,
        objectId,
        filePath
      );
    } catch (error) {}
  }

  async uploadFile(
    objectName: string,
    stream: Stream,
    metaData: object = {},
    size?: number,
    callback?: any
  ) {
    try {
      const uploadedFile = await this.minioClient.putObject(
        this.bucketName,
        objectName,
        stream,
        size,
        metaData
      );
      return uploadedFile;
    } catch (error) {
      throw error;
    }
  }
}
