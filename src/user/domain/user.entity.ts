export class User {
    constructor(
        public readonly id: string,
        public readonly nickname: string,
        public readonly nationality: string,
        public readonly createdAt: Date,
    ) {}
}