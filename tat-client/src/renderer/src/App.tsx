import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import './index.css'
import AppRoutes from './routes'

function App(): React.JSX.Element {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App
