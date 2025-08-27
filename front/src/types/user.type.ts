import {UserRoleEnum} from "@/common/enums/user.role.enum";

export type UserType = {
	_id: string,
	email: string,
	role: UserRoleEnum
}