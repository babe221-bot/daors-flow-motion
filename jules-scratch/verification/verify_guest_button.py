from playwright.sync_api import Page, expect
import time

def test_guest_login_flow(page: Page):
    """
    This test verifies the full end-to-end guest login functionality.
    It checks that clicking the "Login as Guest" button successfully logs in the user
    and redirects them to the customer portal.
    """
    try:
        # 1. Navigate to the login page.
        page.goto("http://localhost:5173/login", timeout=60000)

        # 2. Find and click the "Login as Guest" button.
        guest_button = page.get_by_role("button", name="Login as Guest")
        expect(guest_button).to_be_visible(timeout=15000)
        guest_button.click()

        # 3. Wait for navigation and assert that the URL is now the portal page.
        # Increased timeout to allow for backend processing (e.g., cold starts).
        expect(page).to_have_url("http://localhost:5173/portal", timeout=30000)

        # 4. Take a screenshot of the portal page after successful guest login.
        page.screenshot(path="jules-scratch/verification/guest-login-success.png")

        print("\nGuest login E2E test passed: Successfully logged in and redirected to /portal.")

    except Exception as e:
        # If the test fails, take a debug screenshot and print the error.
        page.screenshot(path="jules-scratch/verification/guest-login-failure.png")
        print(f"\nGuest login E2E test failed: {e}")
        # Re-raise the exception to ensure the test is marked as failed.
        raise
