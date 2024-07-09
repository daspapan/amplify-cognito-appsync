import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import {config} from "@/awsconfig";

export const {runWithAmplifyServerContext} = createServerRunner({
    config,
})


export const cookieBasedClient = generateServerClientUsingCookies({
    config,
    cookies,
})