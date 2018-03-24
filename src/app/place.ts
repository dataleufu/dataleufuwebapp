export class ImagePlace {
    constructor(
        public pk: number,
        public image: string,
        public action: string){}
}
export class Point {
    constructor(
        public coordinates: number[])
    {}
}
export class Place {

  constructor(
    public pk: number,
    public description: string,
    public images: ImagePlace[],
    public created: Date,
    public point: string,
    public category: Category,
    public owner: UserProfile

  ){}


}

export class GeoPlace {

  constructor(
    public pk: number,
    public description: string,
    public images: ImagePlace[],
    public created: Date,
    public point: Point,
    public category: Category,
    public owner: UserProfile

  ) {  }
}
export class Category {

  constructor(
    public pk: number,
    public name: string
  ) {  }
}

export const INTERNAL_LAYER = 1;
export const EXTERNAL_LAYER = 2;

export class Layer {

  public datasource: any;

  constructor(
    public pk: number,
    public name: string,
    public type: number,
    public url: string,
    public color: string,
    public size: number,
    public category: Category,
    public visible: boolean
  ) {  }
}

export class UserGroup {
    constructor(
        public pk: number,
        public name: string,
        public description: string,
        public image: string
    ){}
}

export class User {
    constructor(
        public id: number,
        public username: string,
        public first_name: string,
        public last_name: string,
        public email: string,
        public is_staff: boolean,

    ){}
}

export class UserProfile {
    constructor(
        public user: User,

        public description: string,
        public image: string,
        public group: UserGroup
    ){}
}


export class ExifConverter {
    valid: boolean;
    Latitude: number;
    Longitude: number;

    constructor(attrLATITUDE: number[], attrLATITUDE_REF: string, attrLONGITUDE: number[], attrLONGITUDE_REF: string) {
     console.log("ExifConverter constructor attrLATITUDE:", attrLATITUDE);
     console.log("ExifConverter constructor attrLATITUDE_REF:", attrLATITUDE_REF);
     console.log("ExifConverter constructor attrLONGITUDE: ", attrLONGITUDE);
     console.log("ExifConverter constructor attrLONGITUDE_REF: ", attrLONGITUDE_REF);
     this.valid = false;
     if((attrLATITUDE !=null)
       && (attrLATITUDE_REF !=null)
       && (attrLONGITUDE != null)
       && (attrLONGITUDE_REF !=null))
     {
      this.valid = true;

      if(attrLATITUDE_REF == "N"){
       this.Latitude = this.convertToDegree(attrLATITUDE);
      }
      else{
       this.Latitude = 0 - this.convertToDegree(attrLATITUDE);
      }

      if(attrLONGITUDE_REF == "E"){
       this.Longitude = this.convertToDegree(attrLONGITUDE);
      }
      else{
       this.Longitude = 0 - this.convertToDegree(attrLONGITUDE);
      }

     }
    };

    convertToDegree(DMS:number[]): number{
        var FloatD = DMS[0];
        var FloatM = DMS[1];
        var FloatS = DMS[2];
        return FloatD + (FloatM/60) + (FloatS/3600);
    };

    isValid(): boolean
    {
     return this.valid;
    }


}
