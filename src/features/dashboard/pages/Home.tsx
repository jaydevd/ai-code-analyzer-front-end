import QuickActions from "../components/QuickActions";
import RepositoryTable from "../components/RepositoryTable";
import Topbar from "../components/Topbar";

const Home = () => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar />

      <main className="overflow-y-auto p-8">
        <div className="mx-auto max-w-7xl space-y-8">

          <QuickActions />

          <RepositoryTable />

        </div>
      </main>
    </div>
  )
}

export default Home;