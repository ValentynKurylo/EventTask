import { useMutation } from '@tanstack/react-query';
import api from '../utils/api';
import {TokenResponse, User, UserDto} from '@/types/auth.type';

export const useRegister = () =>
	useMutation<TokenResponse, unknown, UserDto>({
		mutationFn: async (dto: UserDto) => {
			const { data } = await api.post<TokenResponse>('/auth/register', dto);
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			return data;
		},
	});

export const useLogin = () =>
	useMutation<TokenResponse, unknown, UserDto>({
		mutationFn: async (dto: UserDto) => {
			const { data } = await api.post<TokenResponse>('/auth/login', dto);
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			return data;
		},
	});

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	window.location.href = '/login';
};

export const getUser = (): User | null => {
	const storedUser = localStorage.getItem("user");
	if (storedUser) {
		return JSON.parse(storedUser);
	}
	return null
}