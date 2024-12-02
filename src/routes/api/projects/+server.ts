import {json} from '@sveltejs/kit'
import {loadProjects} from '$lib/import-data'
import type {Project} from '$lib/types'

export async function GET() {
  const projectLookup = await loadProjects()
  const projects = Object.values(projectLookup)
    .map<Project>(project => ({name: project.name, slug: project.slug}))
    .sort((a, b) => a.name.localeCompare(b.name))

  return json(projects)
}
