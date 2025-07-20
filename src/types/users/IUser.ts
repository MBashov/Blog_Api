type SocialLinks = {
    website?: string,
    facebook?: string;
    instagram?: string,
    linkedIn?: string;
    x?: string,
    youtube?: string;
};

export interface IUser {
    username: string,
    email: string,
    password: string,
    role: 'admin' | 'user',
    firstName?: string,
    lastName?: string,
    socialLinks?: SocialLinks,
}