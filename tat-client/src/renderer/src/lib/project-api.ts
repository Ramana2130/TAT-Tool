import API_URL from './api'

export interface CreateProjectRequest {
  projectName: string
  technologyName: string
  projectPath: string
}

export interface ProjectResponse {
  id: number
  projectName: string
  technologyName: string
  projectPath: string
  status: string
  createdAt: string
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  const response = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(request)
  })

  if (!response.ok) {
    let message = 'Project creation request failed'

    try {
      const error = await response.json()

      message = error.message || error.error || message
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(message)
  }

  return response.json()
}
export async function getProjects(): Promise<ProjectResponse[]> {
  const response = await fetch(`${API_URL}/api/projects`)

  if (!response.ok) {
    let message = 'Failed to fetch projects'

    try {
      const error = await response.json()

      message = error.message || error.error || message
    } catch {
      // Ignore
    }

    throw new Error(message)
  }

  return response.json()
}

export async function updateProjectName(
  projectId: number,
  projectName: string
): Promise<ProjectResponse> {
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      projectName
    })
  })

  if (!response.ok) {
    let message = 'Failed to update project'

    try {
      const error = await response.json()

      message = error.message || error.error || message
    } catch {
      // Ignore
    }

    throw new Error(message)
  }

  return response.json()
}

/*
 * Delete project
 */
export async function deleteProject(projectId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    let message = 'Failed to delete project'

    try {
      const error = await response.json()

      message = error.message || error.error || message
    } catch {
      // Ignore
    }

    throw new Error(message)
  }
}
