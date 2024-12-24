export type IDriver = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  status: 'active' | 'suspended' | 'deleted';
  image: string;
  phone: string;
};
