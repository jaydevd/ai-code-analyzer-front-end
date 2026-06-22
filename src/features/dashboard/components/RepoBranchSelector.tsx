import Select from "@/components/ui/Select";
import type { Branch } from "../types/dashboard.types";

interface RepoOption {
  id: string;
  name: string;
}

interface RepoBranchSelectorProps {
  repos: RepoOption[];
  branches: Branch[];
  selectedRepo: string;
  selectedBranch: string;
  onRepoChange: (repoName: string) => void;
  onBranchChange: (branchName: string) => void;
  reposLoading?: boolean;
  branchesLoading?: boolean;
  disabled?: boolean;
}

const RepoBranchSelector = ({
  repos,
  branches,
  selectedRepo,
  selectedBranch,
  onRepoChange,
  onBranchChange,
  reposLoading = false,
  branchesLoading = false,
  disabled = false,
}: RepoBranchSelectorProps) => {
  const repoOptions = repos.map((repo) => ({
    value: repo.name,
    label: repo.name,
  }));

  const branchOptions = branches.map((branch) => ({
    value: branch.name,
    label: branch.name,
  }));

  return (
    <div className="flex gap-1 pl-7">
      <Select
        options={repoOptions}
        value={selectedRepo}
        onChange={onRepoChange}
        placeholder="Select repository"
        disabled={disabled || reposLoading}
        loading={reposLoading}
      />

      <Select
        options={branchOptions}
        value={selectedBranch}
        onChange={onBranchChange}
        placeholder="Branch"
        disabled={disabled || !selectedRepo || branchesLoading}
        loading={branchesLoading}
      />
    </div>
  );
};

export default RepoBranchSelector;