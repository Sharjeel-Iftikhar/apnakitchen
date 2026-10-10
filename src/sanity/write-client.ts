import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

const token = process.env.SANITY_API_WRITE_TOKEN;

/** Client with write access (creates order documents). Null until configured. */
export const writeClient =
  isSanityConfigured && token
    ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
    : null;
