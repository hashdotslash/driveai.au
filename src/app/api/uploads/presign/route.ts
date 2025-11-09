import { NextRequest } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
const region = process.env.AWS_REGION || "ap-southeast-2";
const bucket = process.env.AWS_S3_BUCKET as string;
const s3 = new S3Client({ region });
export async function POST(req: NextRequest) {
  if (!bucket) return new Response("Missing AWS_S3_BUCKET", { status: 500 });
  const { fileName, fileType } = await req.json();
  const Key = `uploads/${Date.now()}-${fileName}`;
  const { url, fields } = await createPresignedPost(s3, {
    Bucket: bucket, Key, Conditions: [["content-length-range", 0, 10*1024*1024]], Expires: 60, Fields: { "Content-Type": fileType },
  });
  return Response.json({ url, fields, key: Key });
}
