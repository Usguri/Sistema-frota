import { Route, Routes, Navigate } from 'react-router-dom';
import TelaPrincipal from './components/TelaPrincipal';
import TelaListaCaminhoes from './components/TelaListaCaminhoes';
import TelaGerarRelatoriosGraficos from './components/TelaGerarRelatoriosGraficos';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/tela-principal" />} />
        <Route path="/tela-principal" element={<TelaPrincipal />} />
        <Route path="/tela-lista-caminhoes" element={<TelaListaCaminhoes />} />
        <Route path="/relatorios" element={<TelaGerarRelatoriosGraficos />} />
    </Routes>
);

export default AppRoutes;
