# Output from Dashboard Tester for mobile-edge-cases

Here is a comprehensive testing checklist for the `/dashboard/appearance` page, focusing on mobile viewports:

**Mobile Viewport Testing Checklist: /dashboard/appearance**

**1. Side-by-Side Phone Preview**

* Test the side-by-side phone preview functionality on a 375px wide screen (iPhone 8/SE/6S+).
	+ Verify that the preview remains visible and functional.
	+ Ensure the preview accurately reflects the applied settings (e.g., theme, layout, colors).

**2. Theme Settings**

* Test various theme settings on mobile viewports:
	+ Light/Dark modes: Verify that the themes switch correctly and affect the preview's appearance.
	+ Custom theme colors: Confirm that custom color changes are reflected in the preview.

**3. Layout Options**

* Test layout options (e.g., grid, list) on mobile viewports:
	+ Verify that the selected layout is applied to the preview.
	+ Ensure the layout does not cause any layout shifts or broken elements.

**4. Font Sizes and Styles**

* Test font sizes and styles on mobile viewports:
	+ Apply various font sizes and styles (e.g., bold, italic) to individual items or sections.
	+ Verify that font changes are reflected in the preview without causing layout issues.

**5. Image Uploads**

* Test image uploads on mobile viewports:
	+ Upload images of varying resolutions and aspect ratios.
	+ Verify that images display correctly in the preview, with no distortion or cropping.

**6. Rapid Clicking**

* Perform rapid clicking tests to ensure the appearance settings do not freeze or become unresponsive:
	+ Quickly toggle between different theme settings or layout options.
	+ Confirm that the preview updates correctly without lagging or freezing.

**7. Edge Cases: Extreme Values**

* Test extreme values for appearance settings on mobile viewports:
	+ Enter very long text or username in the input fields (e.g., 100 characters).
	+ Verify that the preview does not become distorted or cause errors.

**8. Mobile-Specific Issues**

* Perform tests to identify any mobile-specific issues, such as:
	+ Scrolling issues on smaller screens.
	+ Tap targets becoming too small for comfortable tapping.

**Additional Tips:**

* Use a combination of manual testing and automated testing tools (e.g., Selenium) to cover more scenarios.
* Test with different browsers and devices (e.g., Google Chrome, Mozilla Firefox, Samsung Galaxy S22) to ensure compatibility.

By following this checklist, we can ensure that the `/dashboard/appearance` page functions correctly on mobile viewports, providing a seamless user experience for our customers.