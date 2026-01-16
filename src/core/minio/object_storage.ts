export interface ObjectStorage{
    getUploadableUrl(objectId:string, bucketName?:string, expiryTime?:number),
    getDownloadableUrl(objectId:string),
    getUrlFromObjectIds(objectArr: Array<string>),
    getObjectEtag(objectId:string, bucketName?:string),
    checkEtag(objectId:string, etag:string),
    checkEtagInArray(params: Array<{objectId:string, etag:string}>),
    getStoredObjectArray(params: Array<{objectId:string, etag:string}>, subFolder?:string)
} 