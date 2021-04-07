import axios from 'axios';
import { servicesKeys } from './keys.service';

export enum MoviesServiceErrorTypes {
    NOT_SEND_ALL_FIELDS,
    UNAUTHORIZED,
}

export class MoviesServiceError extends Error {

    readonly type : MoviesServiceErrorTypes;

    constructor(message: string, type : MoviesServiceErrorTypes) {
        super(message);
        this.type = type;
    }
}

export default class MoviesService {
    
    static async getMovies(page: number, token : string | null) : Promise<any[] | null> {
        let error = null;
        let films : null | any[] = null;
        await axios.request({
            method: 'GET',
            url: `http://${servicesKeys.serverIp}:${servicesKeys.port}/movies?page=${page}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(
            (response) => {
                films = <any> response;
            },
            (reason) => {
                switch (reason.response.status) {
                    case 400:
                        error = new MoviesServiceError(reason.response.data, MoviesServiceErrorTypes.NOT_SEND_ALL_FIELDS);
                        break;
                    case 401:
                        error = new MoviesServiceError(reason.response.data, MoviesServiceErrorTypes.UNAUTHORIZED);
                        break;
                }
            }
        );
        if (error) {
            throw error;
        }
        return films;
    }
}