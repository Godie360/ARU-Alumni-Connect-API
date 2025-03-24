import { UserRole } from '../enums/user-role.enum';

export interface JwtPayload {
  email: string;
  id: string;
  role: UserRole;
}