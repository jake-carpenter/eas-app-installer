import {GET} from './+server'

vi.doMock('$lib/data/builds.json', () => ({
  default: []
}))

describe('GET /api/projects', async () => {
  test('returns a list of projects', async () => {
    vi.doMock('$lib/data/builds.json', () => ({
      default: [
        {project: {slug: 'project-1', name: 'Project 1'}},
        {project: {slug: 'project-2', name: 'Project 2'}}
      ]
    }))

    const response = await GET()
    const data = await response.json()

    expect(data).toHaveLength(2)
    expect(data[0]).toEqual({slug: 'project-1', name: 'Project 1'})
    expect(data[1]).toEqual({slug: 'project-2', name: 'Project 2'})
  })

  test('sorts the projects by name alphanumerically', async () => {
    const projects = ['Carrot', 'apple', 'BANANA']

    vi.doMock('$lib/data/builds.json', () => ({
      default: projects.map(name => ({project: {slug: name.toLowerCase(), name}}))
    }))

    const response = await GET()
    const data = await response.json()

    expect(data[0].name).toBe('apple')
    expect(data[1].name).toBe('BANANA')
    expect(data[2].name).toBe('Carrot')
  })
})
