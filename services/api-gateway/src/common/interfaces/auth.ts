import { Observable } from 'rxjs';
import { AuthDto } from 'src/auth/dto/auth.dto';

export interface AuthService {
  signUp(data: AuthDto): Observable<{ accessToken: string }>;
  signIn(data: AuthDto): Observable<{ accessToken: string }>;
}
