import { format } from 'date-fns';

export const isValidDate = (value: string | Date): boolean => {
  if (!value) return false;
  return !isNaN(new Date(value).getTime());
};

export const dateToIsoString = (value: string | Date): string => {
  const date = new Date(value);
  const isoString = date.toISOString();
  return format(isoString, "yyyy-MM-dd'T'HH:mm:ss");
};
