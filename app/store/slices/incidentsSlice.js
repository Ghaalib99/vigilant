import { fetchIncidents } from "@/app/services/incidentService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch incidents
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

const incidentsSlice = createSlice({
  name: "incidents",
  initialState: {
    incidents: [],
    loading: false,
    error: null,
    selectedIncidentId: null,
    selectedAssignmentId: null,
    selectedBankId: null,
    selectedIncidentStatus: null,
  },
  reducers: {
    setIncidentId: (state, action) => {
      state.selectedIncidentId = action.payload;
    },
    setAssignmentId: (state, action) => {
      state.selectedAssignmentId = action.payload;
    },
    setBankId: (state, action) => {
      state.selectedBankId = action.payload;
    },
    setIncidentStatus: (state, action) => {
      state.selectedIncidentStatus = action.payload;
    },
    updateIncidentStatus: (state, action) => {
      if (state.selectedIncidentId === action.payload.incidentId) {
        state.selectedIncidentStatus = action.payload.status;
      }
    },
  },
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
      });
  },
});

// Export actions
export const {
  setIncidentId,
  setAssignmentId,
  setBankId,
  setIncidentStatus,
  updateIncidentStatus,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
