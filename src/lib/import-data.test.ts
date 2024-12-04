import {loadProjects} from './import-data'
import type {Build} from '$lib/types'

describe('import-data', () => {
  test('should return projects as a lookup keyed by the slug', async () => {
    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        {project: {slug: 'project-1', name: 'Project 1'}, completedAt: '2021-01-01T00:00:00Z'},
        {project: {slug: 'project-2', name: 'Project 2'}, completedAt: '2021-01-01T00:00:00Z'}
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
        {
          project: {slug: 'project-1', name: 'Project 1'},
          platform: 'IOS',
          completedAt: '2021-01-01T00:00:00Z'
        },
        {
          project: {slug: 'project-1', name: 'Project 1'},
          platform: 'ANDROID',
          completedAt: '2021-01-01T00:00:01Z'
        }
      ]
    }))

    const projects = await loadProjects({forceRefresh: true})

    expect(projects['project-1'].builds).toHaveLength(2)
  })

  test('should map all data required data for a build', async () => {
    const build: Build = {
      id: '42',
      platform: 'IOS',
      completedAt: '2021-01-01T00:00:00Z'
    }

    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        {
          id: build.id,
          project: {slug: 'project-1', name: 'arbitrary'},
          platform: build.platform,
          completedAt: build.completedAt
        }
      ]
    }))

    const projects = await loadProjects({forceRefresh: true})
    expect(projects['project-1'].builds[0]).toEqual(build)
  })

  test('should sort builds in a project by latest completed date to oldest', async () => {
    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        {
          id: '1',
          project: {slug: 'project-1', name: 'arbitrary'},
          platform: 'IOS',
          completedAt: '2021-01-01T00:00:00Z'
        },
        {
          id: '3',
          project: {slug: 'project-1', name: 'arbitrary'},
          platform: 'IOS',
          completedAt: '2021-01-01T00:02:00Z'
        },
        {
          id: '2',
          project: {slug: 'project-1', name: 'arbitrary'},
          platform: 'ANDROID',
          completedAt: '2021-01-01T00:01:00Z'
        }
      ]
    }))

    const projects = await loadProjects({forceRefresh: true})
    const builds = projects['project-1'].builds

    expect(builds.map(b => b.id)).toEqual(['3', '2', '1'])
  })
})
