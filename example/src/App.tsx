import React from 'react';
import { ArrowDown, Close, Menu } from './assets/icons';

function App() {
  return (
    <div className="app">
      <h1>SVG 아이콘 예제</h1>
      <div className="icons">
        <div className="icon-item">
          <ArrowDown />
          <span>ArrowDown</span>
        </div>
        <div className="icon-item">
          <Close />
          <span>Close</span>
        </div>
        <div className="icon-item">
          <Menu />
          <span>Menu</span>
        </div>
      </div>
      <p>
        이 아이콘들은 <code>vite-plugin-svgr-indexer</code>에 의해 자동으로 생성된 
        <code>index.ts</code> 파일에서 가져온 것입니다.
      </p>
      <style jsx>{`
        .app {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        .icons {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
        }
        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        svg {
          width: 48px;
          height: 48px;
          color: #333;
        }
      `}</style>
    </div>
  );
}

export default App; 