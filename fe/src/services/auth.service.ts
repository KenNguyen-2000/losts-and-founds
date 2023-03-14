import { AxiosResponse } from 'axios';
import { IUser } from '../interfaces/user';
import interceptor from './interceptor';

class AuthService {
  constructor() {}

  login = async (email: string, password: string): Promise<AxiosResponse> => {
    ('service');
    const res = await interceptor.post('/users/login', { email, password });
    return res;
  };

  getUserInfo = async (): Promise<AxiosResponse> => {
    ('Get user info service');
    const res = await interceptor.get('/users');
    return res;
  };
}

const authService = new AuthService();

export default authService;
