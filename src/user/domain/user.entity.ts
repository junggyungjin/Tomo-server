export class User {
    constructor(
        public readonly id: string,
        public readonly provider: string,
        public readonly providerId: string,
        public readonly email: string | null,
        public readonly nickname: string,
        public readonly handle: string,
        public readonly nationality: string,
        public readonly createdAt: Date,
    ) {}
}