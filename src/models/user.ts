//* Node modules
import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt';

export interface IUser {
    username: string,
    email: string,
    password: string,
    role: 'admin' | 'user',
    firstName?: string,
    lastName?: string,
    socialLinks?: {
        website?: string,
        facebook?: string,
        instagram?: string,
        linkedIn?: string,
        x?: string,
        youtube?: string,
    },
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            minlength: [3, 'Username must be at least 3 characters'],
            maxLength: [20, 'Username must be at most 20 characters'],
            unique: [true, 'Username must be unique'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxLength: [50, 'Email must be at most 50 characters'],
            match: [
                /^\S+@\S+\.\S+$/,
                'Email format is invalid',
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
            maxLength: [20, 'First name must be less than 20 characters'],
        },
        lastName: {
            type: String,
            maxLength: [20, 'Last name must be less than 20 characters'],
        },
        socialLinks: {
            website: {
                type: String,
                maxLength: [100, 'Website address must be less than 100 characters'],
            },

            facebook: {
                type: String,
                maxLength: [100, 'Facebook profile url must be less than 100 characters'],
            },

            instagram: {
                type: String,
                maxLength: [100, 'Instagram profile url must be less than 100 characters'],
            },

            linkedIn: {
                type: String,
                maxLength: [100, 'LinkedIn profile url must be less than 100 characters'],
            },

            x: {
                type: String,
                maxLength: [100, 'X profile url must be less than 100 characters'],
            },

            youtube: {
                type: String,
                maxLength: [100, 'Youtube chanel url must be less than 100 characters'],
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