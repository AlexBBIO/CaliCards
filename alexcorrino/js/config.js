/*
 * alexcorrino.com — site configuration
 * =====================================
 * This is the ONLY file you need to edit to update the site.
 *
 * Projects render in the order listed. Fields:
 *   name    — display name
 *   domain  — shown as small text next to the name (optional)
 *   url     — link target; LEAVE EMPTY while a project isn't live yet and
 *             the card renders as an unlinked "in progress" entry
 *   status  — "live" or "building"
 *   blurb   — one or two sentences on what it is
 */
window.SITE_CONFIG = {
  projects: [
    {
      name: "Factor Watch",
      domain: "factorwatch.ai",
      url: "https://factorwatch.ai",
      status: "live",
      blurb:
        "Daily factor internals over the FW 3000: point-in-time quintile portfolios, z-scored moves, rotation flags, breadth and seasonality. Updated through the session.",
    },
    {
      name: "Memory Analyst",
      domain: "memoryanalyst.com",
      url: "https://memoryanalyst.com",
      status: "live",
      blurb:
        "The AI memory thesis on annual rates. Yearly HBM demand is set to outrun global manufacturing capacity this decade. This site tracks the gap.",
    },
    {
      name: "Mind The Tape",
      domain: "mindthetape.com",
      url: "https://www.mindthetape.com",
      status: "live",
      blurb:
        "A weekly read on global markets: price, flows and positioning. Fewer headlines, more signal.",
    },
    // Add future projects here, e.g.:
    // {
    //   name: "Example Project",
    //   domain: "example.com",
    //   url: "https://example.com",
    //   status: "live",
    //   blurb: "One or two sentences on what the project is.",
    // },
  ],

  // Public links. LEAVE EMPTY to hide — the "Elsewhere" section only appears
  // once at least one link is set, so nothing personal is ever published by
  // accident. Only add addresses/handles that belong to the Alex Corrino
  // pseudonym.
  links: {
    x: "",        // e.g. "https://x.com/alexcorrino"
    github: "",   // e.g. "https://github.com/alexcorrino"
    substack: "", // e.g. "https://alexcorrino.substack.com"
    email: "",    // e.g. "hello@alexcorrino.com" — never a personal address
  },
};
