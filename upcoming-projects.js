// Shared "Upcoming Projects" data — edit this ONE file and both the Landing
// and Press pages pick up the change (title, image, status, credits).
export const UPCOMING_PROJECTS = [
  {
    id: "kill-me",
    title: "Kill Me",
    imageSlot: "kill-me-still-v4",
    imageSrcLanding: "uploads/kill-me-poster-faces-v2.jpg",
    imageSrcPress: "uploads/kill-me-poster-faces-v2.jpg",
    imageFit: "cover",
    placeholder: "Drop a still from Kill Me",
    landingSubtitle: "TAC Funded Short — Shooting Nov 2026",
    pressSubtitle: "TAC Funded Short",
    pressRole: "Written, Directed, and Created by Shani McKenzie \u00B7 Produced by Joshua DeSouza",
    pressStatus: "Shooting Nov 2026",
    summary: ""
  },
  {
    id: "ride-the-tide",
    title: "Ride The Tide",
    imageSlot: "ride-the-tide-still-v2",
    imageSrcLanding: "uploads/ride-the-tide-landing-final.png",
    imageSrcPress: "uploads/slot-ride-the-tide-still-16x9.png",
    imageFit: "cover",
    placeholder: "Drop a still from Ride The Tide",
    landingSubtitle: "Music Video \u2014 In Post-Production",
    pressSubtitle: "Music Video",
    pressRole: "Directed and Produced by Joshua DeSouza \u00B7 Co-Directed by Chelsea \u00B7 \u201CAre You A Killer?\u201D by Sneaky Link (Hitman Records)",
    pressStatus: "In Post-Production",
    summary: ""
  },
  {
    id: "bitsy",
    title: "Bitsy",
    imageSlot: "bitsy-logo-v2",
    imageSrcLanding: "uploads/bitsy-landing-final.png",
    imageSrcPress: "uploads/slot-bitsy-logo-16x9.png",
    imageFit: "contain",
    bg: "#ffffff",
    placeholder: "Drop the Bitsy logo",
    landingSubtitle: "Pilot Episode — Shooting Oct 2026",
    pressSubtitle: "Pilot Episode",
    pressRole: "Created and Written by Queen Chelsea VFX \u00B7 Directed and Produced by Joshua DeSouza",
    pressStatus: "Shooting Oct 2026",
    summary: ""
  }
];

export async function loadUpcoming() {
  const { loadContent } = await import('./site-content.js');
  const c = await loadContent();
  return Array.isArray(c.upcoming) ? c.upcoming : UPCOMING_PROJECTS;
}
