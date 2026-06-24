import { Search } from "lucide-react";
import { useState } from "react";

import SearchDialog from "./SearchDialog";

const Topbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-center border-b border-white/10 px-8 py-5">
        <div className="relative w-full max-w-lg">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-left text-white transition hover:border-white/20"
          >
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <span className="text-zinc-500">Search repositories...</span>
          </button>
        </div>
      </header>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Topbar;
