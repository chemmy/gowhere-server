export type LocationTrafficImageType = {
  id: string;
  latitude: number;
  longitude: number;
  image: string;
  name?: string;
};

export type TrafficCameraType = {
  camera_id: string;
  image: string;
  image_metadata: {
    height: number;
    width: number;
    md5: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
};

export type TrafficImagesResponseType = {
  data: {
    items: Array<{
      cameras: Array<TrafficCameraType>;
    }>;
  };
};
