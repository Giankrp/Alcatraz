import { NuxtAuthHandler } from "#auth";
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const config = useRuntimeConfig()
export default NuxtAuthHandler({
    secret: config.secret,
    providers: [
        // @ts-expect-error Use .default here for it to work during SSR.
        GithubProvider.default({
            clientId: config.auth.github.clientId,
            clientSecret: config.auth.github.clientSecret

        }),
        // @ts-expect-error Use .default here for it to work during SSR.
        GoogleProvider.default({
            clientId: config.auth.google.clientId,
            clientSecret: config.auth.google.clientSecret
        })
    ]
})