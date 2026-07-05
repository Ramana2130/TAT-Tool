'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { TerminalOutput } from './terminal-output'

interface Project {
  id: string
  name: string
  framework: string
  description: string
  status: 'success' | 'running' | 'failed'
  timestamp?: string
  icon: React.ComponentType<{ className?: string }>
}

interface ProjectDrawerProps {
  project: Project | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDrawer({ project, isOpen, onOpenChange }: ProjectDrawerProps) {
  if (!project) return null

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="border-b border-border">
          <DrawerTitle>{project.name}</DrawerTitle>
          <DrawerDescription>{project.framework}</DrawerDescription>
        </DrawerHeader>

        {/* Terminal Output */}
        <div className="flex-1 overflow-hidden">
          <TerminalOutput projectId={project.id} projectName={project.name} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
