import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FolderKanban,
  Pencil,
  Trash2
} from 'lucide-react'

import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  deleteProject,
  getProjects,
  updateProjectName,
  type ProjectResponse
} from '@/lib/project-api'

import { toast } from 'sonner'

export function ProjectTable() {
  /*
   * Projects
   */
  const [projects, setProjects] = useState<ProjectResponse[]>([])

  /*
   * Loading state
   */
  const [loading, setLoading] = useState(true)

  /*
   * Pagination
   */
  const [page, setPage] = useState(1)

  const [pageSize, setPageSize] = useState(10)

  /*
   * Edit dialog
   */
  const [editOpen, setEditOpen] = useState(false)

  const [editName, setEditName] = useState('')

  /*
   * Delete dialog
   */
  const [deleteOpen, setDeleteOpen] = useState(false)

  /*
   * Selected project
   */
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null)

  /*
   * Action loading
   */
  const [actionLoading, setActionLoading] = useState(false)

  /*
   * Load projects
   */
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)

      const data = await getProjects()

      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)

      toast.error(error instanceof Error ? error.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  /*
   * Pagination
   */
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize))

  const startIndex = (page - 1) * pageSize

  const endIndex = startIndex + pageSize

  const currentProjects = projects.slice(startIndex, endIndex)

  /*
   * Change page size
   */
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value)

    setPageSize(newPageSize)

    setPage(1)
  }

  /*
   * Status badge
   */
  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CREATED':
        return 'default'

      case 'RUNNING':
        return 'secondary'

      case 'CREATING':
        return 'secondary'

      case 'FAILED':
        return 'destructive'

      default:
        return 'outline'
    }
  }

  /*
   * Format date
   */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  /*
   * Open edit dialog
   */
  const handleOpenEdit = (project: ProjectResponse) => {
    setSelectedProject(project)

    setEditName(project.projectName)

    setEditOpen(true)
  }

  /*
   * Update project name
   */
  const handleEditProject = async () => {
    if (!selectedProject) {
      return
    }

    const newName = editName.trim()

    /*
     * Validate
     */
    if (!newName) {
      toast.warning('Project name is required')

      return
    }

    /*
     * Don't call API
     * if name hasn't changed.
     */
    if (newName === selectedProject.projectName) {
      setEditOpen(false)

      return
    }

    try {
      setActionLoading(true)

      const updatedProject = await updateProjectName(selectedProject.id, newName)

      /*
       * Update local table
       */
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      )

      /*
       * Close dialog
       */
      setEditOpen(false)

      setSelectedProject(null)

      setEditName('')

      toast.success('Project name updated successfully')
    } catch (error) {
      console.error('Update project error:', error)

      toast.error(error instanceof Error ? error.message : 'Failed to update project')
    } finally {
      setActionLoading(false)
    }
  }

  /*
   * Open delete dialog
   */
  const handleOpenDelete = (project: ProjectResponse) => {
    setSelectedProject(project)

    setDeleteOpen(true)
  }

  /*
   * Delete project
   */
  const handleDeleteProject = async () => {
    if (!selectedProject) {
      return
    }

    try {
      setActionLoading(true)

      /*
       * Delete from backend
       */
      await deleteProject(selectedProject.id)

      /*
       * Remove from local state
       */
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== selectedProject.id)
      )

      /*
       * Calculate remaining projects
       */
      const remainingCount = projects.length - 1

      /*
       * Calculate new page count
       */
      const newTotalPages = Math.max(1, Math.ceil(remainingCount / pageSize))

      /*
       * If current page no longer
       * exists, move to last page.
       */
      if (page > newTotalPages) {
        setPage(newTotalPages)
      }

      /*
       * Close dialog
       */
      setDeleteOpen(false)

      setSelectedProject(null)

      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Delete project error:', error)

      toast.error(error instanceof Error ? error.message : 'Failed to delete project')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full">
        {/* Header */}

        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg size-9 bg-primary text-primary-foreground">
              <FolderKanban className="size-4" />
            </div>

            <div>
              <CardTitle>Projects</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage all projects created through TAT.
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Table */}

        <CardContent>
          <div className="overflow-hidden border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>

                  <TableHead>Technology</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Location</TableHead>

                  <TableHead>Created</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loading */}

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      Loading projects...
                    </TableCell>
                  </TableRow>
                ) : currentProjects.length === 0 ? (
                  /* Empty */

                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  /* Projects */

                  currentProjects.map((project) => (
                    <TableRow key={project.id}>
                      {/* Project name */}

                      <TableCell className="font-medium">{project.projectName}</TableCell>

                      {/* Technology */}

                      <TableCell>{project.technologyName}</TableCell>

                      {/* Status */}

                      <TableCell>
                        <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                      </TableCell>

                      {/* Location */}

                      <TableCell className="max-w-[300px] truncate" title={project.projectPath}>
                        {project.projectPath}
                      </TableCell>

                      {/* Created */}

                      <TableCell>{formatDate(project.createdAt)}</TableCell>

                      {/* Actions */}

                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit */}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Edit project name"
                            disabled={
                              actionLoading ||
                              project.status === 'CREATING' ||
                              project.status === 'RUNNING'
                            }
                            onClick={() => handleOpenEdit(project)}
                          >
                            <Pencil className="size-4" />
                          </Button>

                          {/* Delete */}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            title="Delete project"
                            disabled={
                              actionLoading ||
                              project.status === 'CREATING' ||
                              project.status === 'RUNNING'
                            }
                            onClick={() => handleOpenDelete(project)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}

          {!loading && projects.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              {/* Result count */}

              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{startIndex + 1}</span> –{' '}
                <span className="font-medium text-foreground">
                  {Math.min(endIndex, projects.length)}
                </span>{' '}
                of <span className="font-medium text-foreground">{projects.length}</span> projects
              </div>

              <div className="flex items-center gap-6">
                {/* Rows */}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows</span>

                  <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-20" size="sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>

                      <SelectItem value="10">10</SelectItem>

                      <SelectItem value="20">20</SelectItem>

                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Page */}

                <div className="text-sm font-medium">
                  Page {page} of {totalPages}
                </div>

                {/* Navigation */}

                <div className="flex items-center gap-1">
                  {/* First */}

                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden size-8 sm:flex"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronsLeft className="size-4" />
                  </Button>

                  {/* Previous */}

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>

                  {/* Next */}

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </Button>

                  {/* Last */}

                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden size-8 sm:flex"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/* EDIT PROJECT DIALOG */}
      {/* ====================================================== */}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>

            <DialogDescription>Change the name of your project.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <Label htmlFor="project-name">Project Name</Label>

            <Input
              id="project-name"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              placeholder="Project name"
              disabled={actionLoading}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>

            <Button onClick={handleEditProject} disabled={actionLoading || !editName.trim()}>
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ====================================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ====================================================== */}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">{selectedProject?.projectName}</span>
              ?
              <br />
              This will remove the project record from TAT.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
