from playwright.sync_api import Page, expect

def test_guest_button(page: Page):
    """
    This test verifies that the "Login as Guest" button is rendered correctly.
    """
    # 1. Navigate to the login page.
    page.goto("http://localhost:5173/login")

    # 2. Assert that the "Login as Guest" button is visible.
    expect(page.get_by_role("button", name="Login as Guest")).to_be_visible()

    # 3. Take a screenshot of the login page.
    page.screenshot(path="jules-scratch/verification/login-page-with-guest-button.png")
