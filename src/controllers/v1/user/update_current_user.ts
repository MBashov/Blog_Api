//* Node modules
import bcrypt from 'bcrypt';

//* Custom modules
import { logger } from "../../../lib/winston.ts";

//* Models
import User from "../../../models/user.ts";

//* Types
import type { Response } from "express";
import type { CustomRequest } from "../../../types/Request.ts";

const updateCurrentUser = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.userId;

    const {
        username,
        email,
        currentPassword,
        newPassword,
        firstName,
        lastName,
        website,
        facebook,
        instagram,
        linkedIn,
        x,
        youtube,
    } = req.body;
    try {
        const user = await User.findById(userId).select('+password -__v').exec();

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found',
            });
            return;
        }
        
        if (username) user.username = username;
        if (email) user.email = email;
        
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            
            if (isMatch) {
                user.password = newPassword;
            } else {
                res.status(400).json({
                    code: 'Bad Request',
                    message: 'Current password is incorrect',
                });
                return;
            }
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (!user.socialLinks) {
            user.socialLinks = {};
        }
        if (website) user.socialLinks.website = website;
        if (facebook) user.socialLinks.facebook = facebook;
        if (instagram) user.socialLinks.instagram = instagram;
        if (linkedIn) user.socialLinks.linkedIn = linkedIn;
        if (x) user.socialLinks.x = x;
        if (youtube) user.socialLinks.youtube = youtube;

        await user.save();

        logger.info('User updated successfully', user);

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err,
        });

        logger.error('Error while updating current user', err);
    }
}

export default updateCurrentUser;