import {GET} from './+server'
import type {ProjectLookup} from '$lib/types'

vi.mock('$lib/import-data', () => {
  return {
    loadProjects: async (): Promise<ProjectLookup> => {
      return {
        'project-2': {
          name: 'Project 2',
          slug: 'project-2',
          builds: [
            {id: 'build-3', platform: 'IOS', completedAt: '2024-01-05T00:00:00Z'},
            {id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-04T00:00:00Z'},
            {id: 'build-1', platform: 'IOS', completedAt: '2024-01-03T00:00:00Z'},
            {id: 'build-5', platform: 'ANDROID', completedAt: '2024-01-07T00:00:00Z'},
            {id: 'build-4', platform: 'IOS', completedAt: '2024-01-06T00:00:00Z'}
          ]
        },
        'project-3': {
          name: 'Project 3',
          slug: 'project-3',
          builds: [
            {id: 'build-1', platform: 'IOS', completedAt: '2024-01-03T00:00:00Z'},
            {id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-04T00:00:00Z'}
          ]
        },
        'project-1': {
          name: 'Project 1',
          slug: 'project-1',
          builds: [
            {id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-02T00:00:00Z'},
            {id: 'build-1', platform: 'IOS', completedAt: '2024-01-01T00:00:00Z'}
          ]
        }
      }
    }
  }
})

describe('GET /api/projects', () => {
  it('should return an array of projects', async () => {
    const response = await GET()
    const projectLookup = await response.json()

    expect(projectLookup).toHaveLength(3)
  })

  it('should return the data for each project excluding build information', async () => {
    const response = await GET()
    const projectLookup = await response.json()

    expect(projectLookup).toEqual([
      {name: 'Project 1', slug: 'project-1'},
      {name: 'Project 2', slug: 'project-2'},
      {name: 'Project 3', slug: 'project-3'}
    ])
  })

  it('should return the projects sorted alphabetically by name', async () => {
    const response = await GET()
    const projectLookup = await response.json()

    expect(projectLookup).toEqual([
      {name: 'Project 1', slug: 'project-1'},
      {name: 'Project 2', slug: 'project-2'},
      {name: 'Project 3', slug: 'project-3'}
    ])
  })
})
