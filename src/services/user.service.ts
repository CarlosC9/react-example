import axios from 'axios';
import { servicesKeys } from './keys.service';

export enum UserServiceErrorTypes {
    NOT_SEND_ALL_FIELDS,
    USERNAME_NOT_EXISTS,
    PASSWORD_NOT_CORRECT,
    USERNAME_ALREADY_EXISTS,  
}

export class UserServiceError extends Error {

    readonly type : UserServiceErrorTypes;

    constructor(message: string, type : UserServiceErrorTypes) {
        super(message);
        this.type = type;
    }
}

export default class UserService {
    
    static async login(username : string, password: string) : Promise<string | null> {
        let error = null;
        let token = null;
        await axios.request({
            method: 'POST',
            url: `http://${servicesKeys.serverIp}:${servicesKeys.port}/user/signin`,
            data: {
                username: username,
                password: password,
            },
        }).then(
            (response) => {
                token = response.data.token;
            },
            (reason) => {
                switch (reason.response.status) {
                    case 400:
                        error = new UserServiceError(reason.response.data, UserServiceErrorTypes.NOT_SEND_ALL_FIELDS);
                        break;
                    case 404:
                        error = new UserServiceError(reason.response.data, UserServiceErrorTypes.USERNAME_NOT_EXISTS);
                        break;
                    case 401:
                        error = new UserServiceError(reason.response.data, UserServiceErrorTypes.PASSWORD_NOT_CORRECT);
                        break;
                }
            }
        );
        if (error) {
            throw error;
        }
        return token;
    } 

    static async signUp(username : string, password: string) : Promise<string | null> {
        let error = null;
        let token = null;
        await axios.request({
            method: 'POST',
            url: `http://${servicesKeys.serverIp}:${servicesKeys.port}/user/signup`,
            data: {
                username: username,
                password: password,
            },
        }).then(
            (response) => {
                token = response.data.token;
            },
            (reason) => {
                switch (reason.response.status) {
                    case 400:
                        error = new UserServiceError(reason.response.data, UserServiceErrorTypes.NOT_SEND_ALL_FIELDS);
                        break;
                    case 403:
                        error = new UserServiceError(reason.response.data, UserServiceErrorTypes.USERNAME_ALREADY_EXISTS);
                        break;
                }
            }
        );
        if (error) {
            throw error;
        }
        return token;
    }
}