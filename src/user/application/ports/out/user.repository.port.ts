import { User } from '../../../domain/user.entity'

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT')

export interface UserRepositoryPort {
    /**
     * 새로운 유저를 DB에 저장합니다
     * @param user 
     * @returns 저장된 도메인 유저 엔티티
     */
    save(user: User): Promise<User>;

    /**
     * ID로 유저를 찾습니다
     * param id 유저의 고유 ID (UUID)
     * returns 찾은 유저 엔티티 (없으면 null)
     */
    findById(id: string): Promise<User | null>;

    /**
     * 이메일로 유저를 찾습니다
     * @param email 
     * @returns 찾은 유저 엔티티 (없으면 null)
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * 소셜 로그인 정보로 유저를 찾는다
     * @param provider 소셜 로그인 제공자 (카카오,라인,애플,구글)
     * @param providerId 소셜 플랫폼에서 제공하는 고유 식별자
     * @returns 찾은 유저 엔티티 (없으면 null)
     */
    findByProvider(provider: string, providerId: string): Promise<User | null>;

    findByHandle(handle: string): Promise<User | null>;

    /**
     * 유저 정보를 업데이트
     * @param user 
     */
    update(user: User): Promise<User>;
}