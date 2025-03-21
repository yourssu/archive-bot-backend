export const getVariousFileType = (mimeType: string | undefined) => {
  if (!mimeType) {
    return 'unknown';
  }

  const [type] = mimeType.toLowerCase().split('/');
  if (type === 'image' || type === 'video') {
    return type;
  }

  return 'unknown';
};
