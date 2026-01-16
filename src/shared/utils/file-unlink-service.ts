import * as fs from "fs";

export class FileUnlinkService {
  public execute(filePath: string): void {
    fs.unlink(filePath, (unlinkError) => {
      if (unlinkError) {
        console.error("Error deleting the file:", unlinkError);
      }else {
        console.log("Successfully removed the file:", filePath);
      }
    });
  }
}
