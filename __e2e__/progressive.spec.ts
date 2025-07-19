import { expect, test } from '@playwright/test';

test.describe('Progressive Tests', () => {
  test('Progressive Tests - Main Page', async ({ page }) => {
    await page.goto('/');

    // Check if the page has loaded by looking for the main heading
    const usersPageHeading = page.getByRole('heading', { name: 'Users' });
    await expect(usersPageHeading).toBeVisible();

    // Check if the "Create" button is visible in the header
    const usersPageHeader = usersPageHeading.locator('..');
    const headerCreateButton = usersPageHeader.getByRole('button', { name: 'Create' });
    await expect(headerCreateButton).toBeVisible();

    // Check if pagination is visible
    const pagination = page.getByRole('navigation', { name: 'Pagination' });
    await expect(pagination).toBeVisible();

    // Check if pagination has buttons with numbers
    const paginationButtons = pagination.getByRole('link').filter({ hasText: /^\d+$/ });
    const paginationButtonsCount = await paginationButtons.count();
    await expect(paginationButtonsCount).toBeGreaterThan(0);

    // Click on a random pagination button
    const randomPaginationButton = paginationButtons.nth(
      Math.floor(Math.random() * paginationButtonsCount),
    );
    const randomPaginationButtonText = await randomPaginationButton.textContent();
    await randomPaginationButton.click();

    // Wait for the page to load after clicking the pagination button
    await page.waitForLoadState('networkidle');

    // Check page url to ensure it has changed
    const currentUrl = page.url();
    await expect(currentUrl).toContain(`/users/${randomPaginationButtonText}`);

    // Check if the page has loaded by looking for the main heading
    const nextUsersPageHeading = page.getByRole('heading', { name: 'Users' });
    await expect(nextUsersPageHeading).toBeVisible();

    const usersList = nextUsersPageHeading.locator('../..').getByRole('list').first();
    await expect(usersList).toBeVisible();

    // Get items in the list
    const usersListItems = usersList.getByRole('listitem');
    const usersListItemsCount = await usersListItems.count();
    await expect(usersListItemsCount).toBeGreaterThan(0);

    // Select a random user from the list
    const randomUserListItem = usersListItems.nth(Math.floor(Math.random() * usersListItemsCount));

    // Selected users list item should have a link and a button
    const randomUserLink = randomUserListItem.getByRole('link');
    const randomUserButton = randomUserListItem.getByRole('button');
    await expect(randomUserLink).toBeVisible();
    await expect(randomUserButton).toBeVisible();

    const randomUserLinkText = (await randomUserLink.textContent()) ?? '';

    // Check if the link text is not empty
    await expect(randomUserLinkText).not.toBe('');

    // Click on the user link
    await randomUserLink.click();

    // Wait for the page to load after clicking the user link
    await page.waitForLoadState('networkidle');

    // Check if the user page has loaded by looking for the user heading
    const userPageHeading = page.getByRole('heading', { level: 1, name: randomUserLinkText });
    await expect(userPageHeading).toBeVisible();

    // Check if header has a "Create Address" button
    const userPageHeader = userPageHeading.locator('../..');
    const headerCreateAddressButton = userPageHeader.getByRole('button', {
      name: 'Create Address',
    });
    await expect(headerCreateAddressButton).toBeVisible();

    // Click on the "Create Address" button
    await headerCreateAddressButton.click();

    // It should open a modal
    const createAddressModal = page.getByRole('dialog', { name: 'Create Address Data' });
    await expect(createAddressModal).toBeVisible();

    // Street input
    const streetInput = createAddressModal.getByRole('textbox', { name: 'Street' });
    await expect(streetInput).toBeVisible();

    // Building Number input
    const buildingNumberInput = createAddressModal.getByRole('textbox', {
      name: 'Building Number',
    });
    await expect(buildingNumberInput).toBeVisible();

    // Post Code input
    const postCodeInput = createAddressModal.getByRole('textbox', { name: 'Post Code' });
    await expect(postCodeInput).toBeVisible();

    // City input
    const cityInput = createAddressModal.getByRole('textbox', { name: 'City' });
    await expect(cityInput).toBeVisible();

    // Country Code input (custom select)
    const countryCodeInput = createAddressModal.getByRole('combobox').last();
    await expect(countryCodeInput).toBeVisible();

    // Submit button
    const submitButton = createAddressModal.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible();

    // Click on the submit button should not submit the form
    // it should show validation errors, error messages should contains the text "required"
    await submitButton.click();
    const validationErrors = createAddressModal.getByText('Street is required');
    await expect(validationErrors).toBeVisible();

    // Test random string
    const randomString = `T_${Math.random().toString(36).substring(2, 6)}`;

    // Fill the form with valid data
    await streetInput.fill(randomString);
    await buildingNumberInput.fill(randomString);
    await postCodeInput.fill(randomString);
    await cityInput.fill(randomString);

    // Click on the country code input to open the select options
    await countryCodeInput.click();
    const countryCodeOption = page.getByRole('option').first();
    await expect(countryCodeOption).toBeVisible();
    await countryCodeOption.click();

    // Click on the submit button
    await submitButton.click();

    // Wait for page refresh
    await page.waitForLoadState('networkidle');

    // Close modal by clicking outside of it
    await page.mouse.click(1, 1);

    // Check if the modal is closed
    await expect(createAddressModal).not.toBeVisible();

    // Find list item containing the random string
    const newAddressListItem = page.getByText(randomString).first().locator('../..');
    await expect(newAddressListItem).toBeVisible();

    // List item should have a button
    const newAddressButton = newAddressListItem.getByRole('button');
    await expect(newAddressButton).toBeVisible();

    // Click on the button to delete the address
    await newAddressButton.click();

    // It should open context menu with "Delete" option
    const contextMenuItemDelete = page.getByRole('menuitem', { name: 'Delete' });
    await expect(contextMenuItemDelete).toBeVisible();

    // Click on the "Delete" option
    await contextMenuItemDelete.click();

    // Wait for page refresh
    await page.waitForLoadState('networkidle');

    // Check if the address is deleted by checking if the list item is not visible
    await expect(newAddressListItem).not.toBeVisible();
  });
});
