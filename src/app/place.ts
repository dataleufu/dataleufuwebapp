export class ImagePlace {
    constructor(
        public pk: number,
        public image: string){}
}
export class Place {

  constructor(
    public pk: number,
    public description: string,
    public title: string,
    public images: ImagePlace[],
    public created: Date,
    public point: string,
    public category: Category

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
