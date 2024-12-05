import type {Build, ExpoBuild, Project} from '$lib/types'
import {faker} from '@faker-js/faker'

const fake = {
  /**
   * Generate a randomized {@link Build} object.
   * @param options Overrides to apply to the generated object.
   */
  Build(options?: Partial<Build>): Build {
    return {
      id: faker.string.uuid(),
      completedAt: faker.date.recent().toISOString(),
      platform: faker.helpers.arrayElement(['IOS', 'ANDROID']),
      appVersion: faker.system.semver(),
      appBuildVersion: faker.number.int().toString(),
      sdkVersion: faker.system.semver(),
      buildProfile: faker.helpers.arrayElement(['development', 'preview', 'production']),
      channel: faker.helpers.arrayElement(['development', 'preview', 'production']),
      runtimeVersion: faker.system.semver(),
      ...options
    }
  },

  /**
   * Generate a randomized {@link Project} object.
   * @param options Overrides to apply to the generated object.
   */
  Project(options?: Partial<Project>): Project {
    return {
      name: faker.company.name(),
      slug: faker.lorem.slug(3),
      ...options
    }
  },

  /**
   * Generate a randomized {@link ExpoBuild} object.
   * @param options Overrides to apply to the generated object.
   */
  ExpoBuild(options?: ExpoBuildFakeOptions): ExpoBuild {
    const platform = options?.platform ?? faker.helpers.arrayElement(['IOS', 'ANDROID'])
    const completedAt = faker.date.recent().toISOString()

    // Coalesce project slug & name from options or generate random values
    const slug = options?.projectSlug ?? options?.project?.slug ?? faker.lorem.slug(3)
    const name = options?.projectName ?? options?.project?.name ?? faker.company.name()

    return {
      id: faker.string.uuid(),
      platform,
      status: 'FINISHED',
      appBuildVersion: faker.number.int().toString(),
      appVersion: faker.system.semver(),
      sdkVersion: faker.system.semver(),
      runtimeVersion: faker.system.semver(),
      buildProfile: faker.helpers.arrayElement(['development', 'preview', 'production']),
      channel: faker.helpers.arrayElement(['development', 'preview', 'production']),
      isForIosSimulator: false,
      expirationDate: faker.date.future().toISOString(),
      completedAt,
      updatedAt: completedAt,
      createdAt: completedAt,
      priority: 'HIGH',
      gitCommitMessage: faker.lorem.words(3),
      gitCommitHash: faker.git.commitSha(),
      distribution: 'INTERNAL',
      project: {id: faker.string.uuid(), name, slug},
      artifacts: {
        buildUrl: faker.internet.url(),
        xcodeBuildLogsUrl: faker.internet.url(),
        applicationArchiveUrl: faker.internet.url(),
        buildArtifactsUrl: faker.internet.url()
      },
      ...options
    }
  }
}

export default fake

interface ExpoBuildFakeOptions extends Partial<ExpoBuild> {
  projectSlug?: string
  projectName?: string
}
