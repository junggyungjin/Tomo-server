import { User } from "src/user/domain/user.entity";

export const GET_USER_USECASE = Symbol('GET_USER_USECASE')

export interface GetUserUseCase {
    /**
     * 유저 ID를 기반으로 유저 정보를 반환
     */
    getUser(userId: string): Promise<User>;
}