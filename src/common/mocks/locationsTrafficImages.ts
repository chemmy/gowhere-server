export const locationTrafficImagesData = [
  {
    camera_id: '01',
    image: 'img-01',
    location: { latitude: 1.1, longitude: 11.11 },
  },
  {
    camera_id: '02',
    image: 'img-02',
    location: { latitude: 2.2, longitude: 22.22 },
  },
];

export const mappedLocationTrafficImages = [
  { id: '01', latitude: 1.1, longitude: 11.11, image: 'img-01' },
  { id: '02', latitude: 2.2, longitude: 22.22, image: 'img-02' },
];

export const mockedTrafficResponse = {
  data: {
    items: [{ cameras: locationTrafficImagesData }],
  },
};
