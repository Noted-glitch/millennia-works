import { S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 is S3-compatible, so we talk to it with the AWS S3 SDK pointed
 * at the R2 endpoint. All credentials are server-only (no NEXT_PUBLIC prefix)
 * so they never reach the browser. The public CDN base URL is the one piece
 * that is public (NEXT_PUBLIC_R2_PUBLIC_URL) since it ends up in <img> tags.
 */

export interface R2Config {
  client: S3Client;
  bucket: string;
  /** Public CDN base URL, with any trailing slash stripped. */
  publicBaseUrl: string;
}

let cachedClient: S3Client | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`R2 is misconfigured: missing environment variable ${name}.`);
  }
  return value;
}

/**
 * Returns a validated R2 client plus bucket/public-URL config. Throws if any
 * required environment variable is missing — callers should catch and surface
 * a generic 5xx so the misconfiguration isn't leaked to clients.
 */
export function getR2(): R2Config {
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const endpoint = requireEnv("R2_ENDPOINT");
  const bucket = requireEnv("R2_BUCKET_NAME");
  const publicBaseUrl = requireEnv("NEXT_PUBLIC_R2_PUBLIC_URL").replace(/\/+$/, "");

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  return { client: cachedClient, bucket, publicBaseUrl };
}
