import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        index: { unique: true }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
}, {
    timestamps: true
})

const User = mongoose.model('User', UserSchema)

export default User;