import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMapState } from '../../../pages/map/interface';

const initialState: IMapState = {
  center: {
    latitude: 60.1699,
    longitude: 24.9384,
  },
  zoom: 12,
  selectedMarker: null,
  showPopup: false,
  userLocation: {
    latitude: null,
    longitude: null,
  },
  address: null,
  mapLoading: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapCenter: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.center = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setSelectedMarker: (state, action: PayloadAction<string | null>) => {
      state.selectedMarker = action.payload;
    },
    setShowPopup: (state, action: PayloadAction<boolean>) => {
      state.showPopup = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.userLocation = action.payload;
    },
    setAddress: (
      state,
      action: PayloadAction<{
        latitude: number;
        longitude: number;
        address: string;
        city?: string;
        country?: string;
        postalCode?: string;
        radiusKm?: number;
      } | null>,
    ) => {
      state.address = action.payload;
    },
    setMapLoading: (state, action: PayloadAction<boolean>) => {
      state.mapLoading = action.payload;
    },
  },
});

export const {
  setMapCenter,
  setMapZoom,
  setSelectedMarker,
  setShowPopup,
  setUserLocation,
  setAddress,
  setMapLoading,
} = mapSlice.actions;

export default mapSlice.reducer;
