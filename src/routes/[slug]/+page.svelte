<script lang="ts">
  import {format} from 'date-fns'

  let {data} = $props()
  const build = data.builds[0]
  console.log(build)
</script>

<h1>{data.project.name}</h1>

<div>
  <h2>Latest build</h2>
  <dl>
    <dt id="app-version-label">App version</dt>
    <dd aria-describedby="app-version-label">{build.appVersion}</dd>
  </dl>
  <dl>
    <dt id="build-number-label">Build number</dt>
    <dd aria-describedby="build-number-label">{build.appBuildVersion}</dd>
  </dl>
  <dl>
    <dt id="completed-time-label">Completed</dt>
    <dd aria-describedby="completed-time-label">
      {format(build.completedAt, 'MM/dd/yy h:mma')}
    </dd>
  </dl>
  <dl>
    <dt id="sdk-version-label">SDK Version</dt>
    <dd aria-describedby="sdk-version-label">{build.sdkVersion}</dd>
  </dl>
  <dl>
    <dt id="channel-label">Channel</dt>
    <dd aria-describedby="channel-label">{build.channel}</dd>
  </dl>
  <dl>
    <dt id="build-profile-label">Profile</dt>
    <dd aria-describedby="build-profile-label">{build.buildProfile}</dd>
  </dl>
  <dl>
    <dt id="runtime-label">Runtime</dt>
    <dd aria-describedby="runtime-label">{build.runtimeVersion}</dd>
  </dl>
</div>
