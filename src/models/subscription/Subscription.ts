


export class Subscription{

    description1: string;
    description2: string;
    description3: string;
    description4: string;
    description5: string;
    price: number;
    title: string;
    createdAt: Date;
    updatedAt: Date | null;

    constructor(description1: string, description2: string, description3:
         string, description4: string, description5: string, price: number,
          title: string,updatedAt: Date | null = null) {
            this.description1 = description1;
            this.description2 = description2;
            this.description3 = description3;
            this.description4 = description4;
            this.description5 = description5;
            this.price = price;
            this.title = title;
            this.createdAt = new Date();
            this.updatedAt = updatedAt;

    }

}