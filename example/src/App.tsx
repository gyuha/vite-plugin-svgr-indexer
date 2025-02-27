import { ArrowDown } from './assets/icons/sub';
import { Close, Menu } from './assets/icons';

function App() {
  return (
    <div className="app">
      <h1>SVG Icon Examples</h1>
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
        These icons are imported from the <code>index.ts</code> file that was automatically 
        generated by <code>vite-plugin-svgr-indexer</code>.
      </p>
      <style>{`
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