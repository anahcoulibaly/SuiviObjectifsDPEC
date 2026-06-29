import { useState } from 'react';
import './index.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ObjectifsPage from './components/ObjectifsPage';
import KPIsPage from './components/KPIsPage';
import GouvernancePage from './components/GouvernancePage';
import ReportingPage from './components/ReportingPage';
import RoadmapPage from './components/RoadmapPage';
import { useAppData } from './hooks/useAppData';

type Page = 'dashboard' | 'objectifs' | 'kpis' | 'gouvernance' | 'reporting' | 'roadmap';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const {
    data,
    updateObjectif,
    updateKPI,
    addSession,
    updateSession,
    deleteSession,
  } = useAppData();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'objectifs':
        return <ObjectifsPage data={data} onUpdateObjectif={updateObjectif} />;
      case 'kpis':
        return <KPIsPage data={data} onUpdateKPI={updateKPI} />;
      case 'gouvernance':
        return (
          <GouvernancePage
            data={data}
            onAddSession={addSession}
            onUpdateSession={updateSession}
            onDeleteSession={deleteSession}
          />
        );
      case 'reporting':
        return <ReportingPage data={data} />;
      case 'roadmap':
        return <RoadmapPage data={data} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
