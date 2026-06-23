import { getRepos } from "@/features/dashboard/api/getRepos";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Repository {
  id: string;
  name: string;
  url: string;
  status: "not_scanned" | "scanning" | "scanned";
  progress?: number;
  files?: number;
  branches?: number;
  chunks?: number;
  default_branch: string
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
  reducers: {
    updateRepoStatus(
      state,
      action: PayloadAction<{
        id: string;
        status: Repository["status"];
        progress?: number;
      }>
    ) {
      const repo = state.repos.find((r) => r.id === action.payload.id);
      if (repo) {
        repo.status = action.payload.status;
        if (action.payload.progress !== undefined) {
          repo.progress = action.payload.progress;
        }
      }
    },
  },
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

export const { updateRepoStatus } = repositorySlice.actions;

export default repositorySlice.reducer;
