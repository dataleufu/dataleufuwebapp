
export class Place {

  constructor(
    public pk: number,
    public description: string,
    public title: string,
    public image: any,
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
