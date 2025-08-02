import { IUser } from './IUser';

export type RegisterUserData = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password' | 'role'>;