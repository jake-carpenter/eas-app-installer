import {json} from '@sveltejs/kit'
import type {Project} from '$lib/types'

export async function GET() {
  const builds = await readImportedBuildJson()
  const projects = builds.map<Project>(x => ({slug: x.project.slug, name: x.project.name}))
  const uniqueSlugs = Array.from(new Map(projects.map(item => [item.slug, item])).values())
  const sorted = uniqueSlugs.sort((a, b) => a.name.localeCompare(b.name))
  return json(sorted)
}

async function readImportedBuildJson() {
  const imported = await import('$lib/data/builds.json')
  return imported.default
}
