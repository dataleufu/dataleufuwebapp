export class ImagePlace {
    constructor(
        public pk: number,
        public image: string){}
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

  ) {  }
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
