import type {Build, Platform, ProjectLookup} from '$lib/types'

let projectLookup: ProjectLookup | undefined

export async function loadProjects({forceRefresh}: {forceRefresh?: boolean} = {}) {
  if (!projectLookup || forceRefresh) {
    const allBuilds = await readImportedBuildJson()
    const mappedBuilds = mapBuilds(allBuilds)
    projectLookup = groupByProject(mappedBuilds)
  }

  return projectLookup
}

async function readImportedBuildJson() {
  const imported = await import('$lib/data/builds.json')
  return imported.default
}

function mapBuilds(builds: Awaited<ReturnType<typeof readImportedBuildJson>>) {
  return builds
    .map<BuildWithProject>(b => ({
      project: {slug: b.project.slug, name: b.project.name},
      build: {
        platform: b.platform as Platform,
        completedAt: new Date(b.completedAt),
        id: b.id
      }
    }))
    .sort((a, b) => b.build.completedAt.getTime() - a.build.completedAt.getTime())
}

function groupByProject(builds: BuildWithProject[]) {
  return builds.reduce<ProjectLookup>((acc, {project, build}) => {
    if (!acc[project.slug]) {
      acc[project.slug] = {slug: project.slug, name: project.name, builds: []}
    }

    acc[project.slug].builds.push(build)
    return acc
  }, {})
}

interface BuildWithProject {
  project: {slug: string; name: string}
  build: Build
}
