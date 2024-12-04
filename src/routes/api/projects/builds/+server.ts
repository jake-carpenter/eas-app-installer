import {error, json} from '@sveltejs/kit'
import {loadProjects} from '$lib/import-data'

export async function GET({url}) {
  if (!url.searchParams.has('project')) {
    error(400, 'Missing project slug')
  }

  const projectLookup = await loadProjects()
  const slug = url.searchParams.get('project')
  const project = projectLookup[slug!]

  return project ? json(project.builds) : json([])
}
