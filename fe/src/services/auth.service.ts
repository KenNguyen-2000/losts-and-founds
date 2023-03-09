import { AxiosResponse } from 'axios';
import { IUser } from '../interfaces/user';
import interceptor from './interceptor';

class AuthService {
  constructor() {}

  login = async (
    username: string,
    password: string
  ): Promise<AxiosResponse> => {
    console.log('service');
    const res = await interceptor.post('/users/login', { username, password });
    return res;
  };
}

const authService = new AuthService();

export default authService;
