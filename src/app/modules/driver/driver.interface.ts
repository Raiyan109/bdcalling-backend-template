import { Types } from 'mongoose';

export type IDriver = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    status: 'active' | 'suspended' | 'deleted';
    image: string;
    phone: string;
    userId: Types.ObjectId;
    isSuspended: boolean;
    suspensionEndDate?: Date;
};