import { loadContent } from './site-content.js';

export const NEWS_ITEMS = [
  {
    id: "hitman", tag: "Team", dateSort: "2026-09",
    dateLabel: "September 2026",
    title: "Now Creative Director and Media Producer at Hit Man Records",
    imageSlot: "hitman-records-logo", imageSrc: "uploads/slot-hitman-records-logo.webp", imageFit: "contain", placeholder: "Add a photo or the Hit Man Records logo"
  },
  {
    id: "grant", tag: "Grant", dateSort: "2026-07",
    dateLabel: "July 2026",
    title: "S. McKenzie & J. DeSouza's \"Kill Me\" awarded TAC grant funding.",
    description: "This funding will work in tandem with the Blue Mountain Film Festival post production grant Mckenzie has already secured.",
    imageSlot: "grant-badge", imageSrc: "uploads/slot-grant-badge.webp", imageFit: "cover", placeholder: "Add a photo or the TAC logo"
  },
  {
    id: "cbc", tag: "Interview", dateSort: "2026-07",
    dateLabel: "July 2026",
    title: "Interviewed on CBC Radio on Gen Z in the workforce",
    description: "Statistics show that Gen Z employees work a higher number of different jobs compared to past generations. DeSouza interviews with Rubina Ahmed-Haq and CBC News to provide thoughts to why this may be.",
    linkHref: "https://www.cbc.ca/listen/live-radio/1-90-columnists-from-cbc-radio/clip/16230882-bounce-buck-how-young-workers-are-hacking-wage",
    linkLabel: "Listen on CBC",
    imageSlot: "cbc-logo", imageSrc: "uploads/slot-cbc-logo-news.png", imageFit: "contain", placeholder: "Add the CBC logo"
  },
  {
    id: "union-house", tag: "Team", dateSort: "2026-02",
    dateLabel: "February 2026",
    title: "Now part of the Union House Films team",
    description: "Union House Films is a collective of like minded filmmakers with complimentary specialty skills, networks and projects united in collaborative efforts and support of one another. Under Union House projects are given access to our diverse team and resources within.",
    linkHref: "https://www.unionhousefilms.com/team",
    linkLabel: "Union House Films",
    imageSlot: "union-house-logo", imageSrc: "uploads/slot-union-house-logo.webp", imageFit: "contain", placeholder: "Add a photo or the Union House logo"
  },
  {
    id: "drop-spot", tag: "Non-profit", dateSort: "2026-04",
    dateLabel: "April 2026",
    title: "Introducing The Drop Spot",
    description: "In effort to reduce the eco footprint left behind on film and TV sets, The Drop Spot aim's to reduce waste by extending the life of unwanted film resources like props, set dressings and raw materials.",
    linkHref: "https://www.thedropspot.org/",
    linkLabel: "The Drop Spot",
    imageSlot: "drop-spot-logo", imageSrc: "uploads/slot-drop-spot-logo.webp", imageFit: "contain", placeholder: "Add a photo or the Drop Spot logo"
  }
];

export async function loadNews() {
  const c = await loadContent();
  return Array.isArray(c.news) ? c.news : NEWS_ITEMS;
}
