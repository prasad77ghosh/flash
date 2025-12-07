export
  interface User {
  _id: any;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  isVerified:boolean,
  createdAt: Date;
  updatedAt: Date;
}