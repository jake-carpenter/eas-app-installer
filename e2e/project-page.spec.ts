import {test, expect} from '@playwright/test'

test('displays 404 page for non-existent project', async ({page}) => {
  await page.goto('/non-existent-project')
  await expect(page.locator('h1')).toHaveText('404')
  await expect(page.locator('p')).toHaveText('Project not found')
})

test('displays the name of the project', async ({page}) => {
  await page.goto('/my-app-name')
  await expect(page.locator('h1')).toHaveText('My App Name')
})

test('displays the latest build', async ({page}) => {
  await page.goto('/my-app-name')

  const definitionId = await page.getByText(/App version/i).getAttribute('id')
  await expect(page.locator(`dd[aria-describedby="${definitionId}"]`)).toHaveText('2.17.0')
})
