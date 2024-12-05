import {loadProjects} from './import-data'
import fake from '$tests/fake'

describe('import-data', () => {
  test('should return projects as a lookup keyed by the slug', async () => {
    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        fake.ExpoBuild({projectSlug: 'project-1', projectName: 'Project 1'}),
        fake.ExpoBuild({projectSlug: 'project-2', projectName: 'Project 2'})
      ]
    }))

    const projects = await loadProjects({forceRefresh: true})

    expect(projects).toBeDefined()
    expect(projects['project-1'].name).toBe('Project 1')
    expect(projects['project-2'].name).toBe('Project 2')
  })

  test('should map each build for a project', async () => {
    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        fake.ExpoBuild({projectSlug: 'project-1', projectName: 'Project 1', platform: 'IOS'}),
        fake.ExpoBuild({projectSlug: 'project-1', projectName: 'Project 1', platform: 'ANDROID'})
      ]
    }))

    const projects = await loadProjects({forceRefresh: true})

    expect(projects['project-1'].builds).toHaveLength(2)
  })

  test('should map all data required data for a build', async () => {
    const build = fake.Build()

    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        {
          id: build.id,
          project: {slug: 'project-1', name: 'arbitrary'},
          platform: build.platform,
          completedAt: build.completedAt,
          appVersion: build.appVersion,
          appBuildVersion: build.appBuildVersion,
          sdkVersion: build.sdkVersion,
          buildProfile: build.buildProfile,
          channel: build.channel,
          runtimeVersion: build.runtimeVersion
        }
      ]
    }))

    const projects = await loadProjects({forceRefresh: true})
    expect(projects['project-1'].builds[0]).toEqual(build)
  })

  test('should sort builds in a project by latest completed date to oldest', async () => {
    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        fake.ExpoBuild({
          id: '1',
          projectSlug: 'project-1',
          projectName: 'Project 1',
          platform: 'IOS',
          completedAt: '2021-01-01T00:00:00Z'
        }),
        fake.ExpoBuild({
          id: '3',
          projectSlug: 'project-1',
          projectName: 'Project 1',
          platform: 'IOS',
          completedAt: '2021-01-01T00:02:00Z'
        }),
        fake.ExpoBuild({
          id: '2',
          projectSlug: 'project-1',
          projectName: 'Project 1',
          platform: 'ANDROID',
          completedAt: '2021-01-01T00:01:00Z'
        })
      ]
    }))

    const projects = await loadProjects({forceRefresh: true})
    const builds = projects['project-1'].builds

    expect(builds.map(b => b.id)).toEqual(['3', '2', '1'])
  })
})
