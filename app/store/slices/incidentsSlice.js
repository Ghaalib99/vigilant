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

// Async thunk to save incident ID
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

// Async thunk to save assignment ID
export const saveAssignmentId = createAsyncThunk(
  "incidents/saveAssignmentId",
  async (assignmentId, { rejectWithValue }) => {
    try {
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to save bank ID
export const saveBankId = createAsyncThunk(
  "incidents/saveBankId",
  async (bankId, { rejectWithValue }) => {
    try {
      return bankId;
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getIncidents pending, fulfilled, and rejected states
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
      // Handle saveIncidentId fulfilled state
      .addCase(saveIncidentId.fulfilled, (state, action) => {
        state.selectedIncidentId = action.payload;
      })
      // Handle saveAssignmentId fulfilled state
      .addCase(saveAssignmentId.fulfilled, (state, action) => {
        state.selectedAssignmentId = action.payload;
      })
      // Handle saveBankId fulfilled state
      .addCase(saveBankId.fulfilled, (state, action) => {
        state.selectedBankId = action.payload;
      });
  },
});

export default incidentsSlice.reducer;
