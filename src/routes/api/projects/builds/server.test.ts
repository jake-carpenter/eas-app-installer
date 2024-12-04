import {GET} from './+server'
import type {Build, ProjectLookup} from '$lib/types'
import {describe} from 'vitest'
import fake from '$tests/fake'

vi.mock('$lib/import-data', () => {
  return {
    loadProjects: async (): Promise<ProjectLookup> => {
      return {
        'project-2': {
          name: 'Project 2',
          slug: 'project-2',
          builds: [
            fake.Build({id: 'build-3', platform: 'IOS', completedAt: '2024-01-05T00:00:00Z'}),
            fake.Build({id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-04T00:00:00Z'}),
            fake.Build({id: 'build-1', platform: 'IOS', completedAt: '2024-01-03T00:00:00Z'}),
            fake.Build({id: 'build-5', platform: 'ANDROID', completedAt: '2024-01-07T00:00:00Z'}),
            fake.Build({id: 'build-4', platform: 'IOS', completedAt: '2024-01-06T00:00:00Z'})
          ]
        },
        'project-3': {
          name: 'Project 3',
          slug: 'project-3',
          builds: [
            fake.Build({id: 'build-1', platform: 'IOS', completedAt: '2024-01-03T00:00:00Z'}),
            fake.Build({id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-04T00:00:00Z'})
          ]
        },
        'project-1': {
          name: 'Project 1',
          slug: 'project-1',
          builds: [
            fake.Build({id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-02T00:00:00Z'}),
            fake.Build({id: 'build-1', platform: 'IOS', completedAt: '2024-01-01T00:00:00Z'})
          ]
        }
      }
    }
  }
})

describe('GET /builds', () => {
  describe('when requested without a project slug', () => {
    it('returns 400', async () => {
      const url = new URL('https://localhost/api/builds')

      await expect(() => GET({url})).rejects.toEqual({
        body: {message: 'Missing project slug'},
        status: 400
      })
    })
  })

  describe('when requested with a project slug parameter', () => {
    it.each([
      {project: 'project-1', length: 2},
      {project: 'project-2', length: 5},
      {project: 'project-3', length: 2}
    ])('returns all $length builds for ?project=$project', async ({project, length}) => {
      const url = new URL(`https://localhost/api/builds?project=${project}`)
      const response = await GET({url})
      const builds = (await response.json()) satisfies Build[]

      expect(builds).toHaveLength(length)
    })

    it('returns build data for the requested project', async () => {
      const url = new URL(`https://localhost/api/builds?project=project-1`)
      const response = await GET({url})
      const builds = (await response.json()) satisfies Build[]

      expect(builds).toEqual([
        {id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-02T00:00:00Z'},
        {id: 'build-1', platform: 'IOS', completedAt: '2024-01-01T00:00:00Z'}
      ])
    })

    describe('and the project does not exist', () => {
      it('returns an empty array', async () => {
        const url = new URL(`https://localhost/api/builds?project=i-dont-exist`)
        const response = await GET({url})
        const builds = (await response.json()) satisfies Build[]

        expect(builds).toEqual([])
      })
    })
  })
})
