export class User {
    constructor(
        public readonly id: string,
        public readonly provider: string,
        public readonly providerId: string,
        public readonly email: string | null,
        public nickname: string | null,
        public readonly handle: string,
        public nationality: string | null,
        public gender: string | null,
        public profileImageUrl: string | null,
        public readonly createdAt: Date,
    ) { }

    public updateProfile(
        nickname: string | null,
        nationality: string | null,
        gender: string | null,
        profileImageUrl: string | null,
    ): void {
        if (nickname !== undefined) this.nickname = nickname;
        if (nationality !== undefined) this.nationality = nationality;
        if (gender !== undefined) this.gender = gender;
        if (profileImageUrl !== undefined) this.profileImageUrl = profileImageUrl;
    }
}