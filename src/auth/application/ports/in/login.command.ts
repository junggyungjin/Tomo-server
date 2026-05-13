export class LoginCommand {
    constructor(
        public readonly provider: string,
        public readonly providerId: string,
        public readonly token: string,
        public readonly email?: string,
        public readonly name?: string,
    ) { }
}