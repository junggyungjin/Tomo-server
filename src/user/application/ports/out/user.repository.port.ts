import { User } from '../../../domain/user.entity'

export interface UserRepositoryPort {
    // DB에 유저 정보를 저장하고, 저장된 유저 정보를 반환
    save(user: User): Promise<User>;
}