import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMapState } from '../../../pages/map/interface';

const initialState: IMapState = {
  center: {
    latitude: 60.1699, // Helsinki default
    longitude: 24.9384,
  },
  zoom: 12,
  selectedMarker: null,
  showPopup: false,
  userLocation: {
    latitude: null,
    longitude: null,
  },
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
  setMapLoading,
} = mapSlice.actions;

export default mapSlice.reducer;
