import mongoose from 'mongoose';
import { IDriver } from './driver.interface';

const DriverSchema = new mongoose.Schema<IDriver>(
    {
        address: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        firstName: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            default: '',
        },
        lastName: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'suspended', 'deleted'],
            default: 'active',
        },
        isSuspended: {
            type: Boolean,
            default: false,
        },
        suspensionEndDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const Driver = mongoose.model<IDriver>('Driver', DriverSchema);