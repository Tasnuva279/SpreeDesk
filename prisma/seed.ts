import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Verified Unsplash photo ids (coworking + Berlin)
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const OFFICE = {
  desk: "1497366216548-37526070297c",
  people: "1521737604893-d14cc237f11d",
  bright: "1497366811353-6870744d04b2",
  lounge: "1524758631624-e2822e304c36",
  coworking: "1556761175-b413da4baf72",
  meetingA: "1542744173-8e7e53415bb0",
  meetingRoom: "1531973576160-7125cd663d86",
  hub: "1604328698692-f76ea9498e76",
  office: "1560472354-b33ff0c44a43",
  studio: "1567521464027-f127ff144326",
  team: "1606857521015-7f9fcf423740",
  open: "1518005020951-eccb494ad742",
};

const galleryPool = [OFFICE.people, OFFICE.meetingA, OFFICE.lounge, OFFICE.open, OFFICE.team];

const LOCATIONS = [
  {
    slug: "spreebogen-loft", code: "MIT", name: "Spreebogen Loft", district: "Mitte",
    tagline: "Where history meets the future",
    blurb: "Riverside desks steps from the Reichstag and Hauptbahnhof.",
    address: "Paulstraße 3, 10557 Berlin",
    lat: 52.521, lng: 13.369, hero: OFFICE.desk, greenScore: 88, rating: 4.8, reviews: 214,
    amenities: "river-view,quiet,coffee,phone-booths,bike-parking",
  },
  {
    slug: "oranien-works", code: "KRZ", name: "Oranien Works", district: "Kreuzberg",
    tagline: "Where industry meets creativity",
    blurb: "Raw brick and big windows in the heart of X-Berg.",
    address: "Oranienstraße 40, 10999 Berlin",
    lat: 52.502, lng: 13.421, hero: OFFICE.coworking, greenScore: 74, rating: 4.6, reviews: 167,
    amenities: "events,rooftop,coffee,dog-friendly,bike-parking",
  },
  {
    slug: "kollwitz-studio", code: "PBG", name: "Kollwitz Studio", district: "Prenzlauer Berg",
    tagline: "Where calm meets focus",
    blurb: "Bright, quiet desks and great espresso off Kollwitzplatz.",
    address: "Kollwitzstraße 12, 10405 Berlin",
    lat: 52.538, lng: 13.419, hero: OFFICE.lounge, greenScore: 81, rating: 4.7, reviews: 142,
    amenities: "quiet,coffee,wellness,bike-parking,phone-booths",
  },
  {
    slug: "raw-hub", code: "FRH", name: "RAW Hub", district: "Friedrichshain",
    tagline: "Where startups meet late nights",
    blurb: "A high-energy hub by the RAW-Gelände, open late.",
    address: "Revaler Straße 99, 10245 Berlin",
    lat: 52.508, lng: 13.452, hero: OFFICE.hub, greenScore: 70, rating: 4.5, reviews: 188,
    amenities: "events,coffee,late-hours,dog-friendly,rooftop",
  },
  {
    slug: "kurfuerst-offices", code: "CHB", name: "Kurfürst Offices", district: "Charlottenburg",
    tagline: "Where classic meets corporate",
    blurb: "Polished private offices a block from Ku'damm.",
    address: "Kurfürstendamm 194, 10707 Berlin",
    lat: 52.503, lng: 13.322, hero: OFFICE.bright, greenScore: 79, rating: 4.7, reviews: 121,
    amenities: "quiet,coffee,phone-booths,parking,wellness",
  },
  {
    slug: "sonnenallee-collective", code: "NKN", name: "Sonnenallee Collective", district: "Neukölln",
    tagline: "Where culture meets community",
    blurb: "A buzzing, affordable collective on Sonnenallee.",
    address: "Sonnenallee 67, 12045 Berlin",
    lat: 52.481, lng: 13.439, hero: OFFICE.studio, greenScore: 76, rating: 4.6, reviews: 156,
    amenities: "events,coffee,community,dog-friendly,bike-parking",
  },
];

// Distinct hotdesk base price per location so prices look real, not cloned.
const HOTDESK_PRICE = [5, 4, 4, 3, 6, 3]; // MIT, KRZ, PBG, FRH, CHB, NKN
// Rotating image pool so the same shot is not reused across spaces.
const SEAT_IMG = [
  OFFICE.open, OFFICE.meetingRoom, OFFICE.meetingA, OFFICE.office, OFFICE.team,
  OFFICE.lounge, OFFICE.bright, OFFICE.studio, OFFICE.coworking, OFFICE.desk, OFFICE.people, OFFICE.hub,
];
const seatImg = (idx: number, j: number) => u(SEAT_IMG[(idx * 5 + j) % SEAT_IMG.length], 600);

function seatTypes(idx: number) {
  const h = HOTDESK_PRICE[idx % HOTDESK_PRICE.length];
  return [
    { kind: "hotdesk", label: "Hotdesk", pricePerHour: h, capacity: 1, available: 24, image: seatImg(idx, 0) },
    { kind: "meeting_room", label: "Meeting Room · 4 ppl", pricePerHour: h + 7, capacity: 4, available: 3, image: seatImg(idx, 1) },
    { kind: "meeting_room", label: "Boardroom · 10 ppl", pricePerHour: h + 15, capacity: 10, available: 2, image: seatImg(idx, 2) },
    { kind: "private_office", label: "Private Office", pricePerHour: h + 5, capacity: 4, available: 4, image: seatImg(idx, 3) },
    { kind: "event_venue", label: "Event Venue · 40 ppl", pricePerHour: 55 + idx * 4, capacity: 40, available: 1, image: seatImg(idx, 4) },
  ];
}

async function main() {
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seatType.deleteMany();
  await prisma.perk.deleteMany();
  await prisma.space.deleteMany();
  await prisma.operatorProfile.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.creditWallet.deleteMany();
  await prisma.user.deleteMany();

  const member = await prisma.user.create({
    data: {
      email: "member@spreedesk.com",
      name: "Lena Vogt",
      role: "member",
      wallet: { create: { credits: 40 } },
      subscriptions: {
        create: { plan: "FlexPass 40", status: "active", renewsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
      },
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      email: "operator@spreedesk.com",
      name: "Max Bauer",
      role: "operator",
      operatorProfile: { create: { company: "Spree Spaces GmbH", plan: "Growth" } },
    },
    include: { operatorProfile: true },
  });
  const operatorId = operatorUser.operatorProfile!.id;

  for (let i = 0; i < LOCATIONS.length; i++) {
    const l = LOCATIONS[i];
    const gallery = [galleryPool[i % galleryPool.length], galleryPool[(i + 1) % galleryPool.length], galleryPool[(i + 2) % galleryPool.length]];
    await prisma.space.create({
      data: {
        slug: l.slug, code: l.code, name: l.name, tagline: l.tagline, district: l.district,
        blurb: l.blurb,
        description: `${l.name} (${l.code}) is a SpreeDesk location in ${l.district}. ${l.blurb} Book a hotdesk by the hour, a meeting room for your team, or a private office by the day — and roam to any other SpreeDesk space on a single FlexPass.`,
        amenities: l.amenities, rating: l.rating, reviewCount: l.reviews, greenScore: l.greenScore,
        heroImage: u(l.hero, 1400), images: gallery.map((g) => u(g, 900)).join(","),
        lat: l.lat, lng: l.lng, address: l.address, desks: 24 + i * 4, rooms: 3 + (i % 3),
        operatorId,
        seatTypes: { create: seatTypes(i) },
        perks: {
          create: [
            { title: "First espresso free", partner: "Bonanza Coffee", description: "One free flat white on check-in.", category: "coffee" },
            { title: "BVG day-ticket 50% off", partner: "BVG", description: "Half-price public transport day pass.", category: "mobility" },
          ],
        },
      },
    });
  }

  await prisma.perk.createMany({
    data: [
      { title: "10% off yoga", partner: "Spree Yoga", description: "Drop-in classes across Berlin.", category: "wellness" },
      { title: "First e-bike ride free", partner: "TIER", description: "Unlock fee waived on your first ride.", category: "mobility" },
      { title: "Community events access", partner: "SpreeDesk", description: "Members-only meetups, talks and demo nights.", category: "community" },
      { title: "€10 referral credit", partner: "SpreeDesk", description: "You and a friend each save €10.", category: "community" },
    ],
  });

  // a couple of demo bookings for the member
  const first = await prisma.space.findFirst({ include: { seatTypes: true } });
  if (first) {
    await prisma.booking.create({
      data: {
        userId: member.id, spaceId: first.id, seatTypeId: first.seatTypes[0].id,
        start: new Date(Date.now() + 1000 * 60 * 60 * 24), hours: 4, creditsUsed: 4, status: "confirmed",
      },
    });
  }

  console.log("Seed complete — 6 Berlin locations.");
  console.log("  Member  : member@spreedesk.com");
  console.log("  Operator: operator@spreedesk.com");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
