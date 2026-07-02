import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckIcon, ChevronLeft, FolderKanban, FolderOpen, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import MultiSelect from "../ui/multi-select"
import { TerminalLog } from "./terminal-log"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"

const FRAMEWORK_OPTIONS = ["React", "Vite", "Next.js", "Electron", "Node.js"] as const

export default function ProjectCreateForm() {
  const [projectName, setProjectName] = useState("")
  const [frameworks, setFrameworks] = useState<string[]>(["React"])
  const [projectPath, setProjectPath] = useState("")
  const [confirmDetails, setConfirmDetails] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)

  const toggleFramework = (framework: string) => {
    setFrameworks((current) =>
      current.includes(framework)
        ? current.filter((item) => item !== framework)
        : [...current, framework]
    )
  }

  const pickProjectFolder = async () => {
    const selectedPath = await window.api.selectProjectFolder()
    if (selectedPath) {
      setProjectPath(selectedPath)
    }
  }

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  if (!projectName.trim()) {
    alert("Please enter a project name")
    return
  }

  if (frameworks.length === 0) {
    alert("Please select at least one framework")
    return
  }

  if (!projectPath.trim()) {
    alert("Please choose the project location")
    return
  }

  if (!confirmDetails) {
    alert("Please confirm the project details")
    return
  }

  console.log({
    projectName,
    frameworks,
    projectPath,
  })

  // Open terminal dialog
  setTerminalOpen(true)

  // TODO: Call your Electron backend here
  // await window.api.createProject(...)

  // Demo delay
  await new Promise((resolve) => setTimeout(resolve, 8000))

  // Close dialog automatically
  setTerminalOpen(false)

  setSubmitted(true)
}

  return (
    <div className=" flex w-full max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <FolderKanban className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create Project</h1>
            <p className="text-sm text-muted-foreground">
              Choose your framework, pick a folder, and generate the project.
            </p>
          </div>
        </div>

        {/* <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">
            <ChevronLeft className="size-4" />
            Back
          </Link>
        </Button> */}
      </div>

      <Card className="bg-card/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>
            Fill out the form below to set up your project.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* {submitted && (
            <div>
              <TerminalLog />
            </div>
          )} */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Student Management System"
              />
              <p className="text-sm text-muted-foreground">
                Enter your project name.
              </p>
            </div>

  
            <div className="space-y-2">
  <Label>Frameworks</Label>

  <MultiSelect />

  <p className="text-sm text-muted-foreground">
    Select one or more frameworks.
  </p>
</div>

            <div className="space-y-2">
              <Label htmlFor="projectPath">Project Location</Label>
              <div className="flex gap-3">
                <Input
                  id="projectPath"
                  value={projectPath}
                  onChange={(event) => setProjectPath(event.target.value)}
                  placeholder="Choose a folder path"
                />
                <Button type="button" variant="outline" onClick={pickProjectFolder}>
                  <FolderOpen className="size-4" />
                  Browse
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                The selected folder path will appear in the input.
              </p>
            </div>

            <Separator />

            <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
              <Checkbox
                checked={confirmDetails}
                onCheckedChange={(checked) => setConfirmDetails(Boolean(checked))}
              />
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  I have verified all project details.
                </Label>
                <p className="text-sm text-muted-foreground">
                  Please confirm the project name, framework, and folder path before generating the project.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button asChild variant="outline">
                <Link to="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit">Generate Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>

    {terminalOpen && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
    <div className="absolute left-1/2 top-1/2 w-[900px] h-[550px] -translate-x-1/2 -translate-y-1/2">
      <TerminalLog />
    </div>
  </div>
)}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit"
        onClick={() => setProjectPath("")}
      >
        <X className="size-4" />
        Clear path
      </Button>
    </div>
  )
}
