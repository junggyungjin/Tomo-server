// import { Injectable } from "@nestjs/common";
// import { UserRepositoryPort } from "../../../application/ports/out/user.repository.port"
// import { User } from "src/user/domain/user.entity";

// @Injectable()
// export class UserPersistenceAdapter implements SaveUserPort {

//     async save(user: User): Promise<User> {
//         // 1. Prisma를 이용해 DB에 데이터 저장
//         /* 
//         const savedData = await this.prisma.user.create({
//             data: {
//                 nickname: user.nickname,
//                 nationality: user.nationality,
//             }
//         });
//         */

//         // 가이드용 임시 Mock 데이터 (Prisma 세팅이 완료되면 위 주석을 해제하고 사용하세요)
//         const savedData = {
//             id: 1,
//             nickname: user.nickname,
//             nationality: user.nationality, 
//         };

//         return new User(
//             savedData.nickname,
//             savedData.nationality
//         );
//     }
// }