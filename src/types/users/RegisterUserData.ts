import { IUser } from './IUser';

export type RegisterUserData = Pick<IUser, 'email' | 'password' | 'role'>;