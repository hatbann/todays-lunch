/** @format */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const { v4: uuidv4 } = require("uuid");

// AWS IAM Setting
const AWS_S3_ACCESS_ID = process.env.NEXT_PUBLIC_AWS_S3_ACCESS_ID || "";
const AWS_S3_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY || "";
const AWS_S3_REGION = process.env.NEXT_PUBLIC_AWS_S3_REGION || "";
const AWS_S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "";

const client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_ACCESS_ID,
    secretAccessKey: AWS_S3_ACCESS_KEY,
  },
});
export const uploadImageToS3 = async (
  file: File
): Promise<string | unknown> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = `${uuidv4()}_${file.name}`;

    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key, // 저장시 넣고 싶은 이름
      Body: buffer,
      ACL: "public-read",
      ContentType: "image/jpg",
    });

    const response = await client.send(command);

    return response.$metadata.httpStatusCode === 200
      ? `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`
      : "";
  } catch (error: unknown) {
    return error;
  }
};
