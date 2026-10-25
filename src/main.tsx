import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App'
import { store } from './app/store'
import { ThemeProvider } from './app/ThemeContext'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element '#root' was not found.");

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)
