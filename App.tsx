
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PeaceLoading } from './components/PeaceLoading';
import { OracleGateway } from './components/OracleGateway';
import { TarotDraw } from './components/TarotDraw';
import { TaoistCasting } from './components/TaoistCasting';
import { ResultView } from './components/ResultView';
import { Screen, DivinationPath, DivinationResult } from './types';
import { fetchOracleGuidance } from './services/oracleService';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Loading);
  const [question, setQuestion] = useState('');
  const [path, setPath] = useState<DivinationPath>('TAOIST');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [loadingOracle, setLoadingOracle] = useState(false);

  const startInteraction = (q: string, p: DivinationPath) => {
    setQuestion(q);
    setPath(p);
    setScreen(p === 'TAOIST' ? Screen.TaoistCasting : Screen.TarotDraw);
  };

  const handleInteractionComplete = async (drawInfo: string | string[]) => {
    setLoadingOracle(true);
    const oracleResult = await fetchOracleGuidance(question, path, drawInfo);
    setResult(oracleResult);
    setLoadingOracle(false);
    setScreen(Screen.Result);
  };

  const reset = () => {
    setScreen(Screen.Gateway);
    setQuestion('');
    setResult(null);
  };

  const goBackToGateway = () => {
    setScreen(Screen.Gateway);
  };

  return (
    <Layout>
      {screen === Screen.Loading && (
        <PeaceLoading onComplete={() => setScreen(Screen.Gateway)} />
      )}

      {screen === Screen.Gateway && (
        <OracleGateway onSelect={startInteraction} />
      )}

      {screen === Screen.TarotDraw && (
        <TarotDraw 
          onComplete={(cards) => handleInteractionComplete(cards)} 
          onBack={goBackToGateway}
        />
      )}

      {screen === Screen.TaoistCasting && (
        <TaoistCasting 
          onComplete={(hexagram) => handleInteractionComplete(hexagram)} 
          onBack={goBackToGateway}
        />
      )}

      {screen === Screen.Result && result && (
        <ResultView 
          path={path} 
          question={question} 
          result={result} 
          onReset={reset} 
        />
      )}

      {loadingOracle && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-lg">
          <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6" />
          <p className="text-cyan-400 font-mystic tracking-widest animate-pulse">
            正在观测命运丝线...
          </p>
        </div>
      )}
    </Layout>
  );
};

export default App;
