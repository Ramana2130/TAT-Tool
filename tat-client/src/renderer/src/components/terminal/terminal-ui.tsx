'use client'

import { useState, useRef, useEffect } from 'react'
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
      return 'bg-red-950'
    case 'success':
      return 'bg-green-950'
    case 'warning':
      return 'bg-yellow-950'
    default:
      return 'bg-blue-950'
  }
}

export function TerminalUI() {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: '1',
      name: 'Project Setup',
      logs: [],
      isPaused: false,
      isRunning: true,
    },
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Simulate log output
  useEffect(() => {
    if (!autoScroll) return

    const sampleLogs = [
      {
        type: 'info' as const,
        message: '$ npm install',
        command: 'npm install',
      },
      {
        type: 'info' as const,
        message:
          'Installing dependencies... This may take a few minutes.',
        command: '',
      },
      {
        type: 'info' as const,
        message: 'added 156 packages, and audited 157 packages in 5.3s',
        command: '',
      },
      {
        type: 'success' as const,
        message: '✓ Dependencies installed successfully',
        command: '',
      },
      { type: 'info' as const, message: '', command: '' },
      {
        type: 'info' as const,
        message: '$ next dev',
        command: 'next dev',
      },
      {
        type: 'info' as const,
        message: 'ready - started server on 0.0.0.0:3000, url: http://localhost:3000',
        command: '',
      },
      {
        type: 'success' as const,
        message: '✓ Server running successfully',
        command: '',
      },
      {
        type: 'warning' as const,
        message: '⚠ Build optimization in progress...',
        command: '',
      },
      {
        type: 'success' as const,
        message: '✓ Compiled client and server successfully',
        command: '',
      },
    ]

    const activeTab = tabs.find((t) => t.id === activeTabId)
    if (!activeTab || activeTab.isPaused || !activeTab.isRunning) return

    const interval = setInterval(() => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === activeTabId && !tab.isPaused && tab.isRunning) {
            if (tab.logs.length < sampleLogs.length) {
              return {
                ...tab,
                logs: [
                  ...tab.logs,
                  {
                    id: `${Date.now()}-${Math.random()}`,
                    timestamp: new Date().toLocaleTimeString(),
                    ...sampleLogs[tab.logs.length],
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
    }, 500)

    return () => clearInterval(interval)
  }, [activeTabId, tabs, autoScroll])

  // Auto-scroll to bottom when new logs are added
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
    element.setAttribute('download', `terminal-${activeTab.name.replace(' ', '-')}-${Date.now()}.log`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      html.classList.toggle('dark')
      setIsDarkMode(html.classList.contains('dark'))
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <h1 className="text-lg font-semibold">DevStack Automator Terminal</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card px-4 overflow-x-auto gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              'flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer group transition-colors whitespace-nowrap',
              activeTabId === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="text-sm font-medium">{tab.name}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveTab(tab.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddTab}
          className="flex items-center gap-2 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-slate-950 dark:bg-slate-950 font-mono text-sm p-6 space-y-1"
      >
        {activeTab && activeTab.logs.length > 0 ? (
          activeTab.logs.map((log) => (
            <div
              key={log.id}
              className={cn('flex items-start gap-3 group', getTypeBgColor(log.type))}
            >
              <span className="text-gray-500 text-xs flex-shrink-0 min-w-fit">
                {log.timestamp}
              </span>
              <div className="flex-1 flex items-start justify-between gap-2">
                <span className={cn('flex-1', getTypeColor(log.type))}>
                  {log.message}
                </span>
                {log.command && (
                  <button
                    onClick={() => handleCopyCommand(log.command!)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="Copy command"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-12">
            {activeTab?.isRunning ? 'Waiting for output...' : 'No logs yet'}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={activeTab?.isPaused ? 'default' : 'outline'}
              onClick={handleTogglePause}
              className="gap-2"
            >
              {activeTab?.isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadLog}
              disabled={!activeTab || activeTab.logs.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span>Auto-scroll</span>
            </label>

            <div className="text-xs text-muted-foreground">
              {activeTab ? activeTab.logs.length : 0} lines
            </div>

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  activeTab?.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                )}
              ></div>
              <span className="text-xs text-muted-foreground">
                {activeTab?.isRunning ? 'Running' : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
