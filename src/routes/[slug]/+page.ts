import type {Build, Project} from '$lib/types'
import {error} from '@sveltejs/kit'

export async function load({params, fetch}) {
  const projectsResponse = await fetch('/api/projects')
  const allProjects: Project[] = await projectsResponse.json()
  const project = allProjects.find(p => p.slug === params.slug)

  if (!project) {
    error(404, 'Project not found')
  }

  const buildsResponse = await fetch(`/api/builds?project=${project.slug}`)
  const builds: Build[] = await buildsResponse.json()

  return {
    allProjects,
    project,
    builds
  }
}
