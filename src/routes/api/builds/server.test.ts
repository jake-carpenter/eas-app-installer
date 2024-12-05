import {GET} from './+server'
import type {Build, ProjectLookup} from '$lib/types'
import {describe} from 'vitest'
import fake from '$tests/fake'

let lookup: ProjectLookup = {}

vi.mock('$lib/import-data', () => {
  return {
    loadProjects: () => Promise.resolve(lookup)
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
    it('returns all builds for the project', async () => {
      lookup = {
        'project-1': {
          name: 'Project 1',
          slug: 'project-1',
          builds: [
            fake.Build({id: 'build-4'}),
            fake.Build({id: 'build-3'}),
            fake.Build({id: 'build-2'}),
            fake.Build({id: 'build-1'})
          ]
        }
      }

      const url = new URL(`https://localhost/api/builds?project=project-1`)
      const response = await GET({url})
      const builds = (await response.json()) satisfies Build[]

      expect(builds).toHaveLength(4)
    })

    it('returns build data for the requested project', async () => {
      const build: Build = fake.Build()

      lookup = {
        'project-1': {
          name: 'Project 1',
          slug: 'project-1',
          builds: [build]
        }
      }

      const url = new URL(`https://localhost/api/builds?project=project-1`)
      const response = await GET({url})
      const builds = (await response.json()) satisfies Build[]

      expect(builds).toEqual([build])
    })

    describe('and the project does not exist', () => {
      it('returns an empty array', async () => {
        lookup = {
          'project-1': {name: 'Project 1', slug: 'project-1', builds: []}
        }

        const url = new URL(`https://localhost/api/builds?project=i-dont-exist`)
        const response = await GET({url})
        const builds = (await response.json()) satisfies Build[]

        expect(builds).toEqual([])
      })
    })
  })
})
