import mongoose from 'mongoose'

export const ScheduledWithinSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
}, {timestamps: true}); 
// timestamps: true will automatically create a "createdAt" Date field

