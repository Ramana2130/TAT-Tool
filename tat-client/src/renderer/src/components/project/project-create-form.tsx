import { useRef, useState } from 'react'

import { Link } from 'react-router-dom'

import { FolderKanban, FolderOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Checkbox } from '@/components/ui/checkbox'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Separator } from '@/components/ui/separator'

import { toast } from 'sonner'

import { TerminalLog } from './terminal-log'

import { createProject } from '@/lib/project-api'

export default function ProjectCreateForm() {
  const [projectName, setProjectName] = useState('')

  const [projectPath, setProjectPath] = useState('')

  const [confirmDetails, setConfirmDetails] = useState(false)

  const [terminalOpen, setTerminalOpen] = useState(false)

  const [projectId, setProjectId] = useState<number | null>(null)

  const [creating, setCreating] = useState(false)
  const creatingRef = useRef(false)
  const [technology, setTechnology] = useState('Select')

  /*
   * Select folder
   */
  const pickProjectFolder = async () => {
    try {
      const selectedPath = await window.api.selectProjectFolder()

      if (selectedPath) {
        setProjectPath(selectedPath)
      }
    } catch (error) {
      console.error(error)

      toast.error('Unable to select folder')
    }
  }

  /*
   * Create project
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (creatingRef.current) {
      return
    }

    if (!projectName.trim()) {
      toast.warning('Please enter a project name')
      return
    }

    if (!projectPath.trim()) {
      toast.warning('Please choose the project location')
      return
    }

    if (!confirmDetails) {
      toast.warning('Please confirm the project details')
      return
    }

    /*
     * IMPORTANT
     *
     * projectPath must be the PARENT folder.
     *
     * Example:
     * projectName = jack
     * projectPath = T:\tat-demo
     *
     * NOT:
     * T:\tat-demo\jack
     */

    const cleanProjectName = projectName.trim()
    const cleanProjectPath = projectPath.trim().replace(/[\\/]+$/, '')

    console.log('========== PROJECT REQUEST ==========')

    console.log({
      projectName: cleanProjectName,
      technologyName: technology,
      projectPath: cleanProjectPath
    })

    console.log('====================================')

    try {
      creatingRef.current = true
      setCreating(true)

      /*
       * Send request to Spring Boot
       */
      const project = await createProject({
        projectName: cleanProjectName,
        technologyName: technology,
        projectPath: cleanProjectPath
      })

      console.log('Project created:', project)

      /*
       * Backend returns the database ID immediately.
       */
      setProjectId(project.id)

      /*
       * Now open live terminal.
       */
      setTerminalOpen(true)

      toast.success('Project creation started')
    } catch (error) {
      console.error('Project creation error:', error)

      toast.error(error instanceof Error ? error.message : 'Project creation failed')
    } finally {
      setCreating(false)

      creatingRef.current = false
    }
  }
  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground">
          <FolderKanban className="size-5" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Create Project</h1>

          <p className="text-sm text-muted-foreground">
            Create a React project with live terminal output.
          </p>
        </div>
      </div>

      {/* Form */}

      <Card className="shadow-sm bg-card/90">
        <CardHeader>
          <CardTitle>Project details</CardTitle>

          <CardDescription>Enter the project name and choose where to create it.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project name */}

            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>

              <Input
                id="projectName"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="my-react-app"
                disabled={creating}
              />
            </div>

            {/* Technology */}

            <div className="space-y-2">
              <Label htmlFor="technology">Technology</Label>

              <select
                id="technology"
                value={technology}
                onChange={(event) => setTechnology(event.target.value)}
                disabled={creating}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="Select">Select Technology</option>
                <option value="React JS">React JS</option>
                <option value="Python">Python</option>
              </select>

              <p className="text-sm text-muted-foreground">Select the project technology.</p>
            </div>

            {/* Location */}

            <div className="space-y-2">
              <Label htmlFor="projectPath">Project Location</Label>

              <div className="flex gap-3">
                <Input
                  id="projectPath"
                  value={projectPath}
                  onChange={(event) => setProjectPath(event.target.value)}
                  placeholder="T:\Projects"
                  disabled={creating}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={pickProjectFolder}
                  disabled={creating}
                >
                  <FolderOpen className="size-4" />
                  Browse
                </Button>
              </div>
            </div>

            <Separator />

            {/* Confirmation */}

            <div className="flex items-start gap-3 p-4 border rounded-lg border-amber-500 bg-background">
              <Checkbox
                checked={confirmDetails}
                onCheckedChange={(checked) => setConfirmDetails(Boolean(checked))}
                disabled={creating}
              />

              <div>
                <Label>I have verified the project details.</Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  The project will be created in the selected folder.
                </p>
              </div>
            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3">
              <Button asChild variant="outline" disabled={creating}>
                <Link to="/dashboard">Cancel</Link>
              </Button>

              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* LIVE TERMINAL */}

      {terminalOpen && projectId && (
        <div className="fixed inset-0 z-50 p-6 bg-black/70 backdrop-blur-sm">
          <div className="flex items-center h-full max-w-6xl mx-auto">
            <div className="h-[650px] w-full">
              <TerminalLog
                projectId={projectId}
                onClose={() => {
                  /*
                   * Allow closing terminal
                   * after request has started.
                   */
                  setTerminalOpen(false)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
