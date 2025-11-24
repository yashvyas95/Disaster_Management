export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    username: string;
    email: string;
    role: string;
    departmentId: number;
    tokenType?: string;
}
