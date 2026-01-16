export class EntityMapper<T> {
  type:string;
  value:string;
  static async mapper<U>(data: Map<string, any>[], constructorFn: new () => U): Promise<U[]> {
    const newData: U[] = [];
    data.forEach((item) => {
      const entity = new constructorFn();
      item.forEach((value, key) => {
        entity[key] = value;
      });
      newData.push(entity);
    });
    return newData;
    }
  }

  export class EntityMapperFromRowTypes<T> {
    type:string;
    value:string;
  
    static async mapper<U>(data: Array<any>, constructorFn: new () => U): Promise<U[]> {
      const maps: Map<string, object>[] = [];
       data.forEach(row=>{
        const map = new Map<string, object>();
        row.keys().forEach(key => {
          map.set(key, row.get(key))
        });
        maps.push(map);
      });
  
      const newData: U[] = [];
      maps.forEach((item) => {
        const entity = new constructorFn();
        item.forEach((value, key) => {
          entity[key] = value;
        });
        newData.push(entity);
      });
      return newData;
      }
    }
    
  