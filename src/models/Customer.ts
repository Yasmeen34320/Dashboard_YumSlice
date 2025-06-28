export default class Customer {
    _id: string;
    uid: string;
    username: string;
    email: string;
    phoneNumber?: string;
    image?: string;
    addresses: string[];
    createdAt: string;
    updatedAt: string;
    status: string = 'Loading...';
    totalOrders: number = 0;
    totalSpent: number = 0;

    constructor(data: any) {
        this._id = data._id;
        this.uid = data.uid;
        this.username = data.username;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber || '';
        this.image = data.image || '';
        this.addresses = data.addresses || [];
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
