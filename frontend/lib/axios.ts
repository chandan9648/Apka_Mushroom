import axios, { AxiosError } from "axios";

import { apiBaseUrl } from "./config";

export const api = axios.create({
	baseURL: apiBaseUrl(),
	withCredentials: true,
});

export function axiosErrorCode(err: unknown): string | undefined {
	if (!axios.isAxiosError(err)) return undefined;
	const data = err.response?.data;
	if (data && typeof data === "object" && typeof (data as any).code === "string") return (data as any).code;
	return undefined;
}

export function axiosErrorMessage(err: unknown): string {
	if (axios.isAxiosError(err)) {
		const axiosErr = err as AxiosError<any>;
		const data = axiosErr.response?.data;
		if (data && typeof data === "object" && typeof data.message === "string") return data.message;
		return axiosErr.message;
	}
	if (err instanceof Error) return err.message;
	return "Something went wrong";
}

