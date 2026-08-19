import { useEffect, useRef, useState } from 'react'

import { Terminal as XTerminal } from '@xterm/xterm'

import { FitAddon } from '@xterm/addon-fit'

import { X } from 'lucide-react'

import '@xterm/xterm/css/xterm.css'

import API_URL from '@/lib/api'

interface TerminalLogProps {
  projectId: number
  onClose: () => void
}

export function TerminalLog({ projectId, onClose }: TerminalLogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const terminalRef = useRef<XTerminal | null>(null)

  const [status, setStatus] = useState<'connecting' | 'live' | 'completed' | 'failed'>('connecting')

  /*
   * Create terminal
   */
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const terminal = new XTerminal({
      cursorBlink: true,

      convertEol: true,

      fontFamily: "Consolas, 'Courier New', monospace",

      fontSize: 13,

      scrollback: 5000,

      theme: {
        background: '#0b0d10',

        foreground: '#d4d4d4',

        cursor: '#ffffff',

        black: '#0b0d10',

        red: '#ff5f56',

        green: '#27c93f',

        yellow: '#ffbd2e',

        blue: '#4f9cff',

        magenta: '#c678dd',

        cyan: '#56b6c2',

        white: '#d4d4d4'
      }
    })

    const fitAddon = new FitAddon()

    terminal.loadAddon(fitAddon)

    terminal.open(containerRef.current)

    fitAddon.fit()

    terminalRef.current = terminal

    const observer = new ResizeObserver(() => {
      try {
        fitAddon.fit()
      } catch {
        // Ignore resize errors
      }
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()

      terminal.dispose()

      terminalRef.current = null
    }
  }, [])

  /*
   * Connect SSE
   */
  useEffect(() => {
    const terminal = terminalRef.current

    if (!terminal) {
      return
    }

    terminal.clear()

    terminal.writeln('\x1b[1;34mTAT Project Terminal\x1b[0m')

    terminal.writeln('\x1b[90m──────────────────────────────────────\x1b[0m')

    terminal.writeln('')

    const url = `${API_URL}/api/projects/${projectId}/logs`

    console.log('Connecting SSE:', url)

    const eventSource = new EventSource(url)

    /*
     * Connected
     */
    eventSource.onopen = () => {
      setStatus('live')

      terminal.writeln('\x1b[32m● Connected to project terminal\x1b[0m')

      terminal.writeln('')
    }

    /*
     * Receive backend output
     */
    eventSource.onmessage = (event) => {
      const message = event.data

      terminal.writeln(message)

      /*
       * Completed
       */
      if (message.includes('PROJECT CREATED SUCCESSFULLY')) {
        setStatus('completed')
      }

      /*
       * Failed
       */
      if (message.includes('PROJECT CREATION FAILED')) {
        setStatus('failed')
      }
    }

    /*
     * Connection error
     */
    eventSource.onerror = () => {
      console.error('SSE connection error')

      if (eventSource.readyState === EventSource.CLOSED) {
        setStatus('failed')
      }
    }

    return () => {
      eventSource.close()
    }
  }, [projectId])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b0d10] shadow-2xl">
      {/* Header */}

      <div className="flex h-11 shrink-0 items-center border-b border-white/10 bg-[#15171a] px-4">
        {/* macOS buttons */}

        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f56]" />

          <span className="size-3 rounded-full bg-[#ffbd2e]" />

          <span className="size-3 rounded-full bg-[#27c93f]" />
        </div>

        <span className="ml-4 text-xs text-zinc-400">TAT Terminal</span>

        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <span
              className={`
                size-2 rounded-full
                ${
                  status === 'live'
                    ? 'bg-green-500'
                    : status === 'completed'
                      ? 'bg-green-500'
                      : status === 'failed'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                }
              `}
            />

            <span className="text-xs text-zinc-500">
              {status === 'connecting' && 'Connecting...'}

              {status === 'live' && 'Live'}

              {status === 'completed' && 'Completed'}

              {status === 'failed' && 'Failed'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Terminal */}

      <div ref={containerRef} className="flex-1 min-h-0 p-3" />
    </div>
  )
}
