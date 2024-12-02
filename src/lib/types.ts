export type Platform = 'IOS' | 'ANDROID'

export interface Project {
  slug: string
  name: string
  builds: Build[]
}

export interface Build {
  id: string
  platform: Platform
  completedAt: Date
}
