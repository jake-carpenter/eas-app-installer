export type Platform = 'IOS' | 'ANDROID'

export type ExpoSlug = string

export type ProjectLookup = Record<ExpoSlug, ProjectWithBuilds>

export interface ProjectWithBuilds {
  slug: ExpoSlug
  name: string
  builds: Build[]
}

export interface Build {
  id: string
  platform: Platform
  completedAt: Date
}

export interface Project {
  slug: ExpoSlug
  name: string
}

export interface ExpoBuild {
  id: string
  status: string
  platform: string
  artifacts: ExpoArtifacts
  project: ExpoProject
  channel: string
  distribution: string
  buildProfile: string
  sdkVersion: string
  appVersion: string
  appBuildVersion: string
  runtimeVersion: string
  gitCommitHash: string
  gitCommitMessage: string
  priority: string
  createdAt: string
  updatedAt: string
  completedAt: string
  expirationDate: string
  isForIosSimulator: boolean
}

export interface ExpoArtifacts {
  buildUrl: string
  xcodeBuildLogsUrl: string
  applicationArchiveUrl: string
  buildArtifactsUrl: string
}

export interface ExpoProject {
  id: string
  name: string
  slug: string
}
