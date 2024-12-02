import {json} from '@sveltejs/kit'
import {loadProjects} from '$lib/import-data'

export async function GET() {
  const projectLookup = await loadProjects()
  return json(projectLookup)
}
