import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getR2 } from "@/lib/r2";
import { requireAdmin } from "@/lib/server/auth";
import { slugify } from "@/lib/slug";

// firebase-admin and the AWS SDK both need the Node runtime (not Edge).
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Allowed image MIME types mapped to the canonical extension we store under.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const CATEGORIES = new Set(["portfolio", "blog", "settings"]);

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const url = body.url;
  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "No URL provided." }, { status: 400 });
  }

  const { client, bucket, publicBaseUrl } = getR2();

  if (!url.startsWith(`${publicBaseUrl}/`)) {
    return NextResponse.json({ error: "URL is not from this CDN." }, { status: 400 });
  }

  const key = url.slice(publicBaseUrl.length + 1);

  // Only allow deletion within known upload categories.
  if (!["portfolio/", "blog/", "settings/"].some((p) => key.startsWith(p))) {
    return NextResponse.json({ error: "Cannot delete this object." }, { status: 403 });
  }

  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("R2 delete failed —", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  // 1. Auth — must be a signed-in admin.
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // 2. Parse the multipart body.
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read upload data." }, { status: 400 });
  }

  const category = String(form.get("category") || "");
  if (!CATEGORIES.has(category)) {
    return NextResponse.json(
      { error: "Invalid category. Expected one of: portfolio, blog, settings." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // 3. Validate type and size.
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5 MB." },
      { status: 413 },
    );
  }

  // 4. Optimise: convert to WebP (max 2000px, quality 85). GIFs are stored as-is.
  const raw = Buffer.from(await file.arrayBuffer());
  let body: Buffer;
  let contentType: string;
  let finalExt: string;

  if (file.type === "image/gif") {
    body = raw;
    contentType = "image/gif";
    finalExt = "gif";
  } else {
    body = await sharp(raw)
      .rotate()                                                      // honour EXIF orientation
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    contentType = "image/webp";
    finalExt = "webp";
  }

  // 5. Build a unique key and upload to R2.
  const baseName = file.name.replace(/\.[^./\\]+$/, "");
  const slug = slugify(baseName) || "image";
  const key = `${category}/${Date.now()}-${slug}.${finalExt}`;

  try {
    const { client, bucket, publicBaseUrl } = getR2();

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000",
      }),
    );

    return NextResponse.json({ url: `${publicBaseUrl}/${key}` });
  } catch (err) {
    console.error("R2 upload failed —", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 502 },
    );
  }
}
