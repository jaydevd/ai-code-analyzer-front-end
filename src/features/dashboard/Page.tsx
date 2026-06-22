import Sidebar from "./components/Sidebar";

// pages
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Repos from "./pages/Repos";

const tabs = {
  home: {
    name: 'home',
    page: 'Home'
  },
  repos: {
    name: 'repos',
    page: 'Repos'
  },
  chat: {
    name: 'chat',
    page: 'Chat'
  }
}

const Page = ({tab}:TabProps) => {
  return (
    <div className="flex h-screen bg-[#020617] text-white scrollbar-thumb-gray-900 scrollbar-thin scrollbar-gutter-auto">
      <Sidebar />
      {tab == 'home' && <Home />}
      {tab == 'repos' && <Repos />}
      {tab == 'chat' && <Chat />}
    </div>
  );
}

export default Page

type TabProps = {
  tab: string;
};