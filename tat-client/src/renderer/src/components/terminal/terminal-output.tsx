'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Download,
  Pause,
  Play,
  Copy,
  X,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LogEntry {
  id: string
  timestamp: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  command?: string
}

interface TerminalTab {
  id: string
  name: string
  logs: LogEntry[]
  isPaused: boolean
  isRunning: boolean
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'text-red-400'
    case 'success':
      return 'text-green-400'
    case 'warning':
      return 'text-yellow-400'
    default:
      return 'text-blue-400'
  }
}

const getTypeBgColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'bg-red-950/30'
    case 'success':
      return 'bg-green-950/30'
    case 'warning':
      return 'bg-yellow-950/30'
    default:
      return 'bg-blue-950/30'
  }
}

interface TerminalOutputProps {
  projectId: string
  projectName: string
}

// Sample log data for different projects
const sampleLogsByProject: Record<string, LogEntry[]> = {
  '1': [
    { id: '1', timestamp: '10:23:45', type: 'info', message: '$ npx create-react-app dashboard', command: 'npx create-react-app dashboard' },
    { id: '2', timestamp: '10:23:46', type: 'info', message: 'Creating a new React app in /projects/dashboard...' },
    { id: '3', timestamp: '10:24:15', type: 'info', message: 'Installing packages. This might take a couple of minutes.' },
    { id: '4', timestamp: '10:24:30', type: 'info', message: 'npm notice' },
    { id: '5', timestamp: '10:24:45', type: 'info', message: 'added 1250 packages, and audited 1251 packages in 45s' },
    { id: '6', timestamp: '10:25:00', type: 'success', message: '✓ React dependencies installed' },
    { id: '7', timestamp: '10:25:05', type: 'info', message: '$ npm install typescript --save-dev' },
    { id: '8', timestamp: '10:25:35', type: 'success', message: '✓ TypeScript installed' },
    { id: '9', timestamp: '10:25:40', type: 'info', message: '$ npm run build' },
    { id: '10', timestamp: '10:26:00', type: 'info', message: 'Compiling dashboard...' },
    { id: '11', timestamp: '10:26:45', type: 'success', message: '✓ Build completed successfully' },
    { id: '12', timestamp: '10:26:50', type: 'success', message: '✓ Project setup completed!' },
  ],
  '2': [
    { id: '1', timestamp: '14:15:20', type: 'info', message: '$ mvn archetype:generate -DgroupId=com.api -DartifactId=spring-api', command: 'mvn archetype:generate' },
    { id: '2', timestamp: '14:15:21', type: 'info', message: 'Creating Spring Boot project structure...' },
    { id: '3', timestamp: '14:15:45', type: 'info', message: 'Generating project files...' },
    { id: '4', timestamp: '14:16:10', type: 'success', message: '✓ Project structure created' },
    { id: '5', timestamp: '14:16:15', type: 'info', message: '$ mvn dependency:resolve' },
    { id: '6', timestamp: '14:16:30', type: 'info', message: 'Downloading dependencies...' },
    { id: '7', timestamp: '14:17:00', type: 'success', message: '✓ Dependencies resolved' },
    { id: '8', timestamp: '14:17:05', type: 'info', message: '$ mvn spring-boot:run' },
    { id: '9', timestamp: '14:17:20', type: 'info', message: 'Starting Spring Boot application...' },
    { id: '10', timestamp: '14:17:35', type: 'warning', message: '⚠ Loading configuration from application.yml' },
    { id: '11', timestamp: '14:17:45', type: 'success', message: '✓ Tomcat started on port 8080' },
  ],
  '3': [
    { id: '1', timestamp: '09:10:15', type: 'info', message: '$ pip install flask numpy pandas scikit-learn', command: 'pip install...' },
    { id: '2', timestamp: '09:10:16', type: 'info', message: 'Installing Python packages...' },
    { id: '3', timestamp: '09:10:45', type: 'info', message: 'Collecting flask...' },
    { id: '4', timestamp: '09:11:30', type: 'error', message: '✕ ERROR: Could not find a version that satisfies the requirement' },
    { id: '5', timestamp: '09:11:31', type: 'warning', message: '⚠ Retrying installation with fallback version...' },
    { id: '6', timestamp: '09:12:00', type: 'error', message: '✕ Installation failed!' },
  ],
  '4': [
    { id: '1', timestamp: '16:45:30', type: 'info', message: '$ ng new angular-enterprise', command: 'ng new angular-enterprise' },
    { id: '2', timestamp: '16:45:31', type: 'info', message: 'Initializing Angular 18 project...' },
    { id: '3', timestamp: '16:46:00', type: 'info', message: 'Creating project files...' },
    { id: '4', timestamp: '16:46:30', type: 'success', message: '✓ Project created' },
    { id: '5', timestamp: '16:46:35', type: 'info', message: '$ npm install' },
    { id: '6', timestamp: '16:47:30', type: 'success', message: '✓ Dependencies installed' },
    { id: '7', timestamp: '16:47:35', type: 'info', message: '$ ng serve' },
    { id: '8', timestamp: '16:48:00', type: 'success', message: '✓ Compilation successful' },
    { id: '9', timestamp: '16:48:05', type: 'success', message: '✓ Application is running on http://localhost:4200' },
  ],
  '5': [
    { id: '1', timestamp: '11:20:00', type: 'info', message: '$ npx create-next-app@latest myapp', command: 'npx create-next-app@latest' },
    { id: '2', timestamp: '11:20:05', type: 'info', message: 'Creating Next.js application...' },
    { id: '3', timestamp: '11:20:30', type: 'info', message: 'Setting up TypeScript configuration...' },
    { id: '4', timestamp: '11:21:00', type: 'success', message: '✓ TypeScript configured' },
    { id: '5', timestamp: '11:21:05', type: 'info', message: '$ npm install' },
    { id: '6', timestamp: '11:22:00', type: 'success', message: '✓ Dependencies installed' },
    { id: '7', timestamp: '11:22:05', type: 'info', message: '$ npm run dev' },
    { id: '8', timestamp: '11:22:20', type: 'success', message: '✓ Development server started' },
    { id: '9', timestamp: '11:22:25', type: 'success', message: '✓ Application ready at http://localhost:3000' },
  ],
  '6': [
    { id: '1', timestamp: '13:30:00', type: 'info', message: '$ npx nuxi init ecommerce', command: 'npx nuxi init' },
    { id: '2', timestamp: '13:30:05', type: 'info', message: 'Initializing Nuxt 3 project...' },
    { id: '3', timestamp: '13:30:20', type: 'info', message: 'Setting up project structure...' },
    { id: '4', timestamp: '13:30:35', type: 'success', message: '✓ Project structure ready' },
    { id: '5', timestamp: '13:30:40', type: 'info', message: '$ npm install' },
  ],
}

export function TerminalOutput({ projectId, projectName }: TerminalOutputProps) {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: '1',
      name: 'Build',
      logs: sampleLogsByProject[projectId] || [],
      isPaused: false,
      isRunning: projectId === '2' || projectId === '6',
    },
    {
      id: '2',
      name: 'Deploy',
      logs: [],
      isPaused: false,
      isRunning: false,
    },
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate live log output for running processes
  useEffect(() => {
    const activeTab = tabs.find((t) => t.id === activeTabId)
    if (!activeTab || activeTab.isPaused || !activeTab.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const simulatedLogs = [
      { type: 'info' as const, message: 'Building project...' },
      { type: 'info' as const, message: 'Compiling source files...' },
      { type: 'warning' as const, message: '⚠ Some dependencies are outdated' },
      { type: 'info' as const, message: 'Running tests...' },
      { type: 'success' as const, message: '✓ All tests passed' },
      { type: 'info' as const, message: 'Generating output...' },
      { type: 'success' as const, message: '✓ Build completed successfully' },
    ]

    const interval = setInterval(() => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === activeTabId && !tab.isPaused && tab.isRunning) {
            if (tab.logs.length < 20) {
              const newLog = simulatedLogs[tab.logs.length % simulatedLogs.length]
              return {
                ...tab,
                logs: [
                  ...tab.logs,
                  {
                    id: `${Date.now()}-${Math.random()}`,
                    timestamp: new Date().toLocaleTimeString(),
                    ...newLog,
                  },
                ],
              }
            } else {
              return { ...tab, isRunning: false }
            }
          }
          return tab
        })
      )
    }, 800)

    intervalRef.current = interval
    return () => {
      clearInterval(interval)
      intervalRef.current = null
    }
  }, [activeTabId, tabs])

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [tabs, autoScroll])

  const activeTab = tabs.find((t) => t.id === activeTabId)

  const handleAddTab = () => {
    const newId = String(Math.max(...tabs.map((t) => parseInt(t.id)), 0) + 1)
    setTabs([
      ...tabs,
      {
        id: newId,
        name: `Terminal ${newId}`,
        logs: [],
        isPaused: false,
        isRunning: false,
      },
    ])
    setActiveTabId(newId)
  }

  const handleRemoveTab = (id: string) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter((t) => t.id !== id)
    setTabs(newTabs)
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id)
    }
  }

  const handleTogglePause = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return { ...tab, isPaused: !tab.isPaused }
        }
        return tab
      })
    )
  }

  const handleRetry = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return { ...tab, logs: [], isRunning: true, isPaused: false }
        }
        return tab
      })
    )
  }

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
  }

  const handleDownloadLog = () => {
    if (!activeTab) return
    const logContent = activeTab.logs
      .map((log) => `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`)
      .join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(logContent)}`)
    element.setAttribute(
      'download',
      `${projectName.replace(/\s/g, '-')}-${activeTab.name.replace(/\s/g, '-')}-${Date.now()}.log`
    )
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 dark:bg-slate-950 text-slate-50">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 overflow-x-auto gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              'flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer group transition-colors whitespace-nowrap text-sm',
              activeTabId === tab.id
                ? 'border-blue-500 text-blue-400 bg-slate-800/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
            onClick={() => setActiveTabId(tab.id)}
          >
            <div className={cn('w-2 h-2 rounded-full', tab.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500')} />
            <span className="font-medium">{tab.name}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveTab(tab.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddTab}
          className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-xs p-6 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
      >
        {activeTab && activeTab.logs.length > 0 ? (
          activeTab.logs.map((log) => (
            <div
              key={log.id}
              className={cn(
                'flex items-start gap-3 group px-2 py-1 rounded transition-colors hover:bg-slate-800/50',
                getTypeBgColor(log.type)
              )}
            >
              <span className="text-slate-500 flex-shrink-0 min-w-fit">{log.timestamp}</span>
              <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                <span className={cn('flex-1 break-words', getTypeColor(log.type))}>
                  {log.message}
                </span>
                {log.command && (
                  <button
                    onClick={() => handleCopyCommand(log.command!)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:text-blue-400"
                    title="Copy command"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-500 text-center py-12">
            {activeTab?.isRunning ? 'Waiting for output...' : 'No logs yet'}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-slate-800 bg-slate-900/50 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeTab?.isPaused ? 'default' : 'outline'}
              onClick={handleTogglePause}
              className="gap-2 text-xs"
            >
              {activeTab?.isPaused ? (
                <>
                  <Play className="w-3 h-3" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" />
                  Pause
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              className="gap-2 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadLog}
              disabled={!activeTab || activeTab.logs.length === 0}
              className="gap-2 text-xs"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="w-3 h-3 rounded"
              />
              <span className="text-slate-300">Auto-scroll</span>
            </label>

            <span className="text-slate-400">{activeTab ? activeTab.logs.length : 0} lines</span>

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  activeTab?.isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-600'
                )}
              />
              <span className="text-slate-400">
                {activeTab?.isRunning ? 'Running' : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
