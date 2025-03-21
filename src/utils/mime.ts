import mime from 'mime';

export const getExtension = (mimetype: string) => {
  if (mimetype === 'video/quicktime') {
    return 'mov';
  }

  return mime.getExtension(mimetype);
};

export const getMimetype = (path: string) => {
  return mime.getType(path);
};
