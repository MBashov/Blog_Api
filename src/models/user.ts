//* Node modules
import { model, Schema, Types } from 'mongoose'
import bcrypt from 'bcrypt';

//* Types
import type { IUser } from '../types/IUser';

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            minlength: [2, 'Username must be at least 2 characters'],
            maxLength: [20, 'Username must be at most 20 characters'],
            unique: [true, 'Username must be unique'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxLength: [50, 'Email must be at most 50 characters'],
            match: [
                /^\S+@\S+\.\S+$/,
                'Invalid email address',
            ],
            unique: [true, 'Email must be unique'],
        },
        password: {
            type: String,
            minlength: [3, 'Password must be at least 3 characters'], //TODO Adjust password requirements
            // match: [
            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            //     'Password must include at least one uppercase letter, one lowercase letter, and one number',
            // ],
            required: [true, 'Password is required'],
            select: false,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['admin', 'user'],
                message: '{VALUE} is not supported => Role must be either \'User\' or \'Admin\'',
            },
            default: 'user',
        },
        firstName: {
            type: String,
            minlength: [2, 'First name must be at least 2 characters'],
            maxLength: [20, 'First name must be less than 20 characters'],
        },
        lastName: {
            type: String,
            minlength: [2, 'Last name must be at least 2 characters'],
            maxLength: [20, 'Last name must be less than 20 characters'],
        },
        socialLinks: {
            website: {
                type: String,
                maxLength: [100, 'Website address must be less than 100 characters'],
                match: [
                    /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}(\/.*)?$/,
                    'Website must be a valid URL (e.g., https://example.com)',
                ],
            },

            facebook: {
                type: String,
                maxLength: [100, 'Facebook profile url must be less than 100 characters'],
                match: [
                    /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/,
                    'Facebook URL must be a valid Facebook profile link starting with https://facebook.com/',
                ],
            },

            instagram: {
                type: String,
                maxLength: [100, 'Instagram profile url must be less than 100 characters'],
                match: [
                    /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+$/,
                    'Instagram URL must be a valid Instagram profile link starting with https://instagram.com/',
                ],
            },

            linkedIn: {
                type: String,
                maxLength: [100, 'LinkedIn profile url must be less than 100 characters'],
                match: [
                    /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+$/,
                    'LinkedIn URL must be a valid LinkedIn profile link starting with https://linkedin.com/in/',
                ],
            },

            x: {
                type: String,
                maxLength: [100, 'X profile url must be less than 100 characters'],
                match: [
                    /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+$/,
                    'X URL must be a valid Twitter/X profile link starting with https://twitter.com/',
                ],
            },

            youtube: {
                type: String,
                maxLength: [100, 'YouTube channel url must be less than 100 characters'],
                match: [
                    /^https:\/\/(www\.)?youtube\.com\/(channel\/[A-Za-z0-9_-]+|c\/[A-Za-z0-9_-]+|user\/[A-Za-z0-9_-]+|@[\w.-]+)$/,
                    'YouTube URL must be a valid channel link starting with https://youtube.com/channel/, /c/, /user/, or /@handle',
                ],
            },
        }
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = model<IUser>('User', userSchema);

export default User;