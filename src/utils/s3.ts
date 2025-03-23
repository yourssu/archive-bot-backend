import {
  GetObjectCommand,
  GetObjectCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
} from '@aws-sdk/client-s3';

import { s3 } from '@/db';

export const checkObjectExists = async (params: HeadObjectCommandInput) => {
  try {
    await headObject(params);
    return true;
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'NotFound') {
      return false;
    }
    throw e;
  }
};

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
