/*
 * CaliCards — site configuration
 * ================================
 * This is the ONLY file you need to edit to update the site.
 * Empty strings render as tasteful "coming soon" states, so nothing breaks
 * while accounts are still being set up.
 */
window.CALICARDS_CONFIG = {
  // Where we sell — fill these in when the accounts exist
  links: {
    ebay: "",    // e.g. "https://www.ebay.com/usr/calicoastcards"
    whatnot: "", // e.g. "https://www.whatnot.com/user/calicoastcards"
  },

  // Social accounts (empty = shown as coming soon)
  socials: {
    instagram: "",
    tiktok: "",
    youtube: "",
    x: "",
  },

  // Where "sell us your cards" inquiries go.
  // LEAVE EMPTY to keep personal email off the public site — the contact
  // buttons then fall back to your first available social/DM link (or a
  // "DMs opening soon" state until one exists). Only set this if you have a
  // dedicated business address you're happy to publish.
  buyingEmail: "",

  // Card shows & cons we're attending. Shown on the home page.
  // date is YYYY-MM-DD; dateEnd is optional for multi-day shows; url is optional.
  // Example:
  // { name: "Collect-A-Con", city: "Long Beach, CA", date: "2026-08-15", dateEnd: "2026-08-16", url: "https://collectacon.com" },
  events: [],
};
