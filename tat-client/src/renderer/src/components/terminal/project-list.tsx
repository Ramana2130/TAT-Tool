'use client'

import { useState } from 'react'
import {
  Cog,
  GitBranch,
  Code2,
  Cpu,
  Database,
  Zap,
  Moon,
  Sun,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProjectDrawer } from './project-drawer'

interface Project {
  id: string
  name: string
  framework: string
  description: string
  status: 'success' | 'running' | 'failed'
  timestamp?: string
  icon: React.ComponentType<{ className?: string }>
}

const projects: Project[] = [
  {
    id: '1',
    name: 'React Dashboard',
    framework: 'React + TypeScript',
    description: 'Modern analytics dashboard with real-time data',
    status: 'success',
    timestamp: 'Completed 2 hours ago',
    icon: Code2,
  },
  {
    id: '2',
    name: 'Spring Boot API',
    framework: 'Spring Boot Java',
    description: 'RESTful API with PostgreSQL integration',
    status: 'running',
    timestamp: 'In progress...',
    icon: Database,
  },
  {
    id: '3',
    name: 'Python ML Pipeline',
    framework: 'Python Flask',
    description: 'Machine learning model serving pipeline',
    status: 'failed',
    timestamp: 'Failed 30 minutes ago',
    icon: Cpu,
  },
  {
    id: '4',
    name: 'Angular Frontend',
    framework: 'Angular 18',
    description: 'Enterprise application frontend',
    status: 'success',
    timestamp: 'Completed yesterday',
    icon: Zap,
  },
  {
    id: '5',
    name: 'Next.js App',
    framework: 'Next.js 16',
    description: 'Full-stack application with API routes',
    status: 'success',
    timestamp: 'Completed 1 week ago',
    icon: GitBranch,
  },
  {
    id: '6',
    name: 'Vue Storefront',
    framework: 'Vue 3 + Nuxt',
    description: 'E-commerce storefront with Nuxt',
    status: 'running',
    timestamp: 'Starting setup...',
    icon: Zap,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
    case 'running':
      return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
    case 'failed':
      return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'success':
      return '✓ Success'
    case 'running':
      return '⚙ Running'
    case 'failed':
      return '✕ Failed'
    default:
      return status
  }
}

export function ProjectList() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      html.classList.toggle('dark')
      setIsDarkMode(html.classList.contains('dark'))
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Projects</h2>
          <p className="text-muted-foreground">
            Click on any project to view terminal output and project details
          </p>
        </div>

                {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 pb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-xs text-muted-foreground">Total Projects</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'success').length}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'running').length}
            </p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'failed').length}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const IconComponent = project.icon
            return (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="group cursor-pointer"
              >
                <div className="relative h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                        getStatusColor(project.status)
                      )}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{project.framework}</p>
                    <p className="text-sm text-foreground/70">{project.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{project.timestamp}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Project Drawer */}
      {selectedProject && (
        <ProjectDrawer
          project={selectedProject}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
    </div>
  )
}
