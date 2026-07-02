import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Api {
    selectProjectFolder: () => Promise<string | null>
    selectProjectFile: () => Promise<string | null>
  }

  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
