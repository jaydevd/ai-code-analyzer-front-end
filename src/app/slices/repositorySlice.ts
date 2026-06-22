import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRepos } from "@/features/dashboard/api/getRepos";

export interface Repository {
  id: string;
  name: string;
  url: string;
  status: "not_scanned" | "scanning" | "scanned";
  progress?: number;
  files?: number;
  branches?: number;
  chunks?: number;
}

interface RepositoryState {
  repos: Repository[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
}

const initialState: RepositoryState = {
  repos: [],
  loading: false,
  error: null,
  hasFetched: false,
};

export const fetchRepos = createAsyncThunk("repos/fetchRepos", async () => {
  const data = await getRepos();
  return data as Repository[];
});

const repositorySlice = createSlice({
  name: "repos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(fetchRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch repositories";
        state.hasFetched = true;
      });
  },
});

export default repositorySlice.reducer;
