import { Observable } from 'rxjs';
import { User } from './types';

export interface AuthService {
  validateToken(data: { accessToken: string }): Observable<User>;
}
