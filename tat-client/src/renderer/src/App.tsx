import { ThemeProvider } from './components/theme-provider';
import './index.css'
import AppRoutes from './routes'

function App(): React.JSX.Element {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App
