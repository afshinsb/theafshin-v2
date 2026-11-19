import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { projects } from "../src/content/projects";

const sizes = [320, 390, 768, 1440, 1920];
for (const width of sizes) {
  test(`home fits ${width}px in light and dark mode`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toHaveText("Software that makes AI useful.");
    for (const dark of [false, true]) {
      if (dark) await page.getByRole("button", { name: "Toggle color theme" }).click();
      await expect(page.getByRole("button", { name: "Toggle color theme" })).toHaveAttribute("aria-pressed", String(dark));
      expect(await page.locator("html").evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.getByRole("link", { name: "Explore projects" })).toBeVisible();
    }
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
}

test("keyboard navigation, pipeline selection, filtering and direct project routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();

  const rail = page.getByRole("figure", { name: "Subtitle translation pipeline" }).first();
  await rail.getByRole("button", { name: "Export" }).focus();
  await page.keyboard.press("Enter");
  await expect(rail.getByRole("button", { name: "Export" })).toHaveAttribute("aria-pressed", "true");
  await expect(rail.getByText("00:00:02.125", { exact: true })).toHaveCount(2);

  await page.getByRole("link", { name: "Explore projects" }).click();
  await page.getByRole("button", { name: "Python", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.getByRole("link", { name: "Read case study for AI Rail" }).click();
  await expect(page.getByRole("heading", { name: "AI Rail", level: 1 })).toBeVisible();
  for (const project of projects) {
    const response = await page.goto(`/projects/${project.slug}/`);
    expect(response?.ok()).toBe(true);
    expect(await response?.text()).toContain('rel="canonical"');
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.name);
    if (project.image) {
      const image = page.getByRole("img", { name: project.image.alt });
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    }
  }
});

test("assistant renders reviewed links, rejects unsafe destinations, and recovers from unavailable service", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    const request = route.request().postDataJSON();
    if (request.message === "Unavailable fixture") return route.fulfill({ status: 503, json: {} });
    await route.fulfill({ json: {
      topic: "subtitle",
      text: "**Subtitle architecture**. [Case study](/projects/universal-subtitle-translator/). [Unsupported link](https://example.org).",
    } });
  });
  await page.goto("/#assistant");
  await page.getByRole("button", { name: "How does subtitle translation work?" }).click();
  const transcript = page.getByRole("log");
  await expect(transcript.getByRole("link", { name: "Case study" })).toHaveAttribute("href", "/projects/universal-subtitle-translator/");
  await expect(transcript.getByText("Unsupported link")).toBeVisible();
  await expect(transcript.getByRole("link", { name: "Unsupported link" })).toHaveCount(0);
  await page.getByRole("textbox", { name: "Your portfolio question" }).fill("Unavailable fixture");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(transcript.getByText(/temporarily unavailable/)).toBeVisible();
  await expect(transcript.getByRole("link", { name: "Browse projects" })).toBeVisible();
});

test("contact form submits verified data and retains a failed message for retry", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route("https://challenges.cloudflare.com/**", async (route) => {
    await route.fulfill({ contentType: "text/javascript", body: `
      window.turnstile = {
        render(el, options) {
          el.dataset.fixtureSize = options.size;
          this.verify = () => options.callback("fixture-turnstile-token");
          this.verify();
          return "widget";
        },
        remove() {},
        reset() { setTimeout(this.verify, 0); }
      };
    ` });
  });
  let calls = 0;
  await page.route("**/api/contact", async (route) => {
    const data = route.request().postDataJSON();
    expect(data).toMatchObject({ name: "Test Visitor", email: "reply@example.org", message: "A test message.", turnstileToken: "fixture-turnstile-token" });
    calls += 1;
    await route.fulfill({ status: calls === 1 ? 502 : 200, json: calls === 1 ? {} : { ok: true } });
  });
  await page.goto("/#contact");
  await page.getByLabel("Name").fill("Test Visitor");
  await expect(page.locator(".verification")).toHaveAttribute("data-fixture-size", "compact");
  await page.getByLabel("Email").fill("reply@example.org");
  await page.getByLabel("Message").fill("A test message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/message could not be sent/)).toBeVisible();
  await expect(page.getByLabel("Message")).toHaveValue("A test message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Thanks. Your message was sent.")).toBeVisible();
  await expect(page.getByLabel("Message")).toHaveValue("");
});

test("axe WCAG AA for desktop light, mobile dark, chat and the flagship case study", async ({ page }) => {
  const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
  const analyze = async () => {
    const result = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
  };
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("html").evaluate(() => document.fonts.ready.then(() => {}));
  await analyze();
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#assistant");
  await expect(page.getByRole("log")).toBeVisible();
  await analyze();
  await page.goto("/projects/universal-subtitle-translator/");
  await analyze();
});
