import {UserRoleEnum} from "@/common/enums/user.role.enum";

export interface UserDto {
	email: string;
	password: string;
}

export interface User {
	id: number;
	role: UserRoleEnum
}

export interface TokenResponse {
	token: string;
	user: User
}
