import { fetchIncidents } from "@/app/services/incidentService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getIncidents = createAsyncThunk(
  "incidents/getIncidents",
  async (authToken, { rejectWithValue }) => {
    try {
      const response = await fetchIncidents(authToken);
      return response.data.assigned_incidents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveIncidentId = createAsyncThunk(
  "incidents/saveIncidentId",
  async (incidentId, { rejectWithValue }) => {
    try {
      return incidentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const incidentsSlice = createSlice({
  name: "incidents",
  initialState: {
    incidents: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = action.payload;
      })
      .addCase(getIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveIncidentId.fulfilled, (state, action) => {
        state.selectedIncidentId = action.payload;
      });
  },
});

export default incidentsSlice.reducer;
