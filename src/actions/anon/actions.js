const NETWORK_TIMEOUT = 5000

/**
 * Writes a search query  on LinkedIn. You must be on the LinkedIn home page to search
 * @param page - Playwright Page object. The page must be on the LinkedIn home page
 * @param networkHelper - Helper object for network-related operations
 * @param query Query to search for
 */
export async function searchOnHomePage(page, networkHelper, query) {
  console.log(`Searching for ${query}`)
  await networkHelper.retryWithBackoff(async () => {
    await page.click('[placeholder="Search"]')
    await page.fill('[placeholder="Search"]', query)
    await page.press('[placeholder="Search"]', 'Enter')
  })
  await networkHelper.waitForPageLoad(page)
}

/**
 * Clicks on the first result of a search page based on the search query type. Your page must be on the search page to click on the first result
 * @param type - The type of search query. Can be "People" or "Companies"
 * @param page - Playwright Page object. The page must be on the search page
 * @param networkHelper - Helper object for network-related operations
 */
export async function clickFirstResultOnSearchPage(type, page, networkHelper) {
  await networkHelper.retryWithBackoff(async () => {
    await networkHelper.waitForNetworkIdle(page)

    // Wait for and click the "People" tab
    const desiredTab = await page.waitForSelector(
      `button.search-reusables__filter-pill-button:has-text("${type}")`
    )
    await desiredTab.click()

    // Wait for the search results to update after clicking the tab
    await networkHelper.waitForNetworkIdle(page)

    // Wait for the search results container to load
    await page.waitForSelector('ul.reusable-search__entity-result-list')

    // Find the first link of the category
    const firstLink = await page
      .locator('li.reusable-search__result-container a.app-aware-link')
      .first()

    // Check if the link exists
    if ((await firstLink.count()) === 0) {
      throw new Error('No person result found')
    }

    // Click on the first link of the category
    await firstLink.click()
  })

  await networkHelper.waitForPageLoad(page)
}

/**
 * Sends a LinkedIn message to a person. Your page must be logged in and must be on the recipient's profile page to send a message. That person must be a 1st degree connection to the delegated user
 * @param networkHelper - Helper object for network-related operations
 * @param message - The message to send
 * @param page - Playwright Page object. The page must be on the recipient's profile page
 */
export const sendMessageOnProfilePage = async (networkHelper, message, page) => {
  try {
    // Wait for and click the "Message" button
    const messageButton = await page.waitForSelector(
      'button.pvs-profile-actions__action:has-text("Message")'
    )
    await messageButton.click()

    // Wait for the message modal to appear
    await page.waitForSelector('div.msg-form__contenteditable')

    // Type the message
    await page.fill('div.msg-form__contenteditable', message)

    await networkHelper.waitForNetworkIdle(page)

    // Wait for and click the Send button using the more specific selector
    await page.waitForSelector('button.msg-form__send-button[type="submit"]')
    await page.click('button.msg-form__send-button[type="submit"]')

    console.log('Waiting for message send confirmation...')
    await Promise.race([
      networkHelper.waitForNetworkIdle(page),
      page.waitForSelector('[aria-label="Message sent"]', {
        state: 'visible',
        timeout: NETWORK_TIMEOUT
      }),
      networkHelper.waitForPageLoad(page)
    ])
      .then(() => console.log('Message send confirmation received.'))
      .catch(() => console.log('Message send confirmation timeout, but proceeding.'))
  } catch (error) {
    // console.error('Error sending message:', error)
    throw new Error(error)
  }
}

/**
 * Sends a LinkedIn message to a recipient. Your page must be logged in and must be on the recipient's profile page to send a message
 * @param networkHelper - Helper object for network-related operations
 * @param recipient - The name of the recipient
 * @param message - The message to send
 * @returns
 */
export const sendMessage = (networkHelper, recipient, message) => async page => {
  await searchOnHomePage(page, networkHelper, recipient)
  await clickFirstResultOnSearchPage('People', page, networkHelper)
  await sendMessageOnProfilePage(networkHelper, message, page)
}

/**
 * Sends a LinkedIn connection request to a person. This would only work if you are not connected with the person and that person is a 2nd degree connection
 * @param networkHelper - Helper object for network-related operations
 * @param personName - The name of the person to send a connection request to
 * @param message - The message to send with the connection request
 * @returns
 */
export const sendConnectionRequest = (networkHelper, personName, message) => async page => {
  try {
    await searchOnHomePage(page, networkHelper, personName)
    await clickFirstResultOnSearchPage('People', page, networkHelper)
    await clickConnectButtonOnPersonPage(page, networkHelper)
    await fulfillConnectionRequestOnConnectionModal(page, networkHelper, personName, message)
  } catch (error) {
    console.error(`An error occurred: ${error}`)
    await networkHelper.takeScreenshot(page, 'linkedin', `error-${personName}`)
    throw new Error(`Cannot get user info for ${personName}`)
  }
}

const actions = {
  sendMessage,
  sendConnectionRequest,
  sendMessageOnProfilePage
}

export default actions
