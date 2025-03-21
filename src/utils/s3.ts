import {
  GetObjectCommand,
  GetObjectCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
} from '@aws-sdk/client-s3';

import { s3 } from '@/db';

export const getObject = async (params: GetObjectCommandInput) => {
  return s3.send(new GetObjectCommand(params));
};

export const headObject = async (params: HeadObjectCommandInput) => {
  return s3.send(new HeadObjectCommand(params));
};

export const getObjectFileSize = async (params: HeadObjectCommandInput) => {
  const { ContentLength } = await headObject(params);
  return ContentLength ?? 0;
};
