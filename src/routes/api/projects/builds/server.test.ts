import {GET} from './+server'
import type {Build, ProjectLookup} from '$lib/types'
import {describe} from 'vitest'

vi.mock('$lib/import-data', () => {
  return {
    loadProjects: async (): Promise<ProjectLookup> => {
      return {
        'project-2': {
          name: 'Project 2',
          slug: 'project-2',
          builds: [
            {id: 'build-3', platform: 'IOS', completedAt: new Date('2024-01-05T00:00:00Z')},
            {id: 'build-2', platform: 'ANDROID', completedAt: new Date('2024-01-04T00:00:00Z')},
            {id: 'build-1', platform: 'IOS', completedAt: new Date('2024-01-03T00:00:00Z')},
            {id: 'build-5', platform: 'ANDROID', completedAt: new Date('2024-01-07T00:00:00Z')},
            {id: 'build-4', platform: 'IOS', completedAt: new Date('2024-01-06T00:00:00Z')}
          ]
        },
        'project-3': {
          name: 'Project 3',
          slug: 'project-3',
          builds: [
            {id: 'build-1', platform: 'IOS', completedAt: new Date('2024-01-03T00:00:00Z')},
            {id: 'build-2', platform: 'ANDROID', completedAt: new Date('2024-01-04T00:00:00Z')}
          ]
        },
        'project-1': {
          name: 'Project 1',
          slug: 'project-1',
          builds: [
            {id: 'build-2', platform: 'ANDROID', completedAt: new Date('2024-01-02T00:00:00Z')},
            {id: 'build-1', platform: 'IOS', completedAt: new Date('2024-01-01T00:00:00Z')}
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
        {id: 'build-2', platform: 'ANDROID', completedAt: '2024-01-02T00:00:00.000Z'},
        {id: 'build-1', platform: 'IOS', completedAt: '2024-01-01T00:00:00.000Z'}
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

    describe('and with a platform parameters', () => {
      test.each([
        {platform: 'iOS', length: 3},
        {platform: 'ios', length: 3},
        {platform: 'IOS', length: 3},
        {platform: 'Android', length: 2},
        {platform: 'android', length: 2},
        {platform: 'ANDROID', length: 2},
        {platform: 'aNdRoId', length: 2}
      ])('returns only the $length builds for %platform', async ({platform, length}) => {
        const url = new URL(`https://localhost/api/builds?project=project-2&platform=${platform}`)
        const response = await GET({url})
        const builds = (await response.json()) satisfies Build[]

        expect(builds).toHaveLength(length)
      })
    })
  })
})
