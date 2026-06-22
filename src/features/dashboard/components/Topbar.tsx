import { Search } from "lucide-react";
import useSearchRepos from './../hooks/useSearchRepos';

const Topbar = () => {
  let searchedRepos = [];
  const search = useSearchRepos();
  const handleChange = async (e:any) => {
    const query = e.target.value;
    const performSearch = await search(query);
    const data = await performSearch();
    searchedRepos = [...data];
  }
  return (
    <header className="flex items-center justify-center border-b border-white/10 px-8 py-5">
      <div className="relative w-full max-w-lg">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />

        <input
          onChange={(e) => handleChange(e)}
          placeholder="Search repositories..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-white outline-none"
        />
      </div>
    </header>
  );
}

export default Topbar