declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_BUCKET_NAME: string;
      S3_BUCKET_REGION: string;
      S3_IAM_ACCESS_KEY_ID: string;
      S3_IAM_SECRET_ACCESS_KEY: string;
    }
  }
}

export {};
