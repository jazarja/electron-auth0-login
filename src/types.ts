// Used for types only; this library does not bundle keytar
import keytar from 'keytar';
import { RequestOptions } from 'https';

export type Keytar = typeof keytar;



// export type Adapter <K extends keyof Context> = (config: Config) => Context[K];
// export type MergedAdapter = (config: Config) => Context;

export type Operation <I, O> = (ctx: Context, input: I) => O;

export type Adapter <I = any, O = any> = (op: Operation<I, O>, ctx: Partial<Context>, cfg: Config) => {
    op: Operation<I, O>,
    ctx: Partial<Context>
};

export type Context = {
    authAPI: {
        // Makes request exchanging refresh token
        exchangeRefreshToken(refreshToken: string): Promise<TokenResponse>,

        // Makes refresh exchanging auth code, using code verifier
        exchangeAuthCode(authCode: string, pair: PKCEPair): Promise<TokenResponse>,
    },
    authWindow: {
        login(pair: PKCEPair): Promise<string>,
        logout(): Promise<void>,
    },
    cryptography: {
        getPKCEChallengePair(): PKCEPair
    },
    net: {
        post <O> (input: object, opts?: RequestOptions): Promise<O>
    },
    logger: {
        warn(...s: string[]): void
    },
    tokens: Store<TokenResponse> & {
        expiresIn(): number
    },
    refreshTokens?: Store<string>
}

export type PKCEPair = {
    verifier: string,
    challenge: string
}

export type TokenResponse = {
    access_token: string,
    expires_in: number
    scope: string,
    refresh_token?: string
    token_type: string
}

export type Config = {
    auth0: {
        audience: string,
        clientId: string,
        domain: string,
        scopes: string
    },
    login?: {
        windowConfig?: object,
        authorizeParams?: object
    },
    logout?: {
        windowConfig?: object
    },
    refreshTokens?:
        | { keytar: typeof keytar, appName: string }
        | { store: Store<string> }
}

export type Store <T> = {
    delete(): Promise<void>,
    get(): Promise<T | null>,
    set(t: T): Promise<void>
}

export type KeytarConfig = {
    keytar: typeof keytar,
    serviceName: string
}