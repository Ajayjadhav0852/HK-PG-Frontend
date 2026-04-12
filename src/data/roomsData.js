// Central source of truth for all rooms and bed availability
// Update 'occupiedBeds' as rooms get booked

export const roomsData = {
  '1-sharing': {
    title: '1 Sharing — Private',
    tag: 'Most Private',
    tagColor: 'bg-purple-100 text-purple-600',
    price: '₹8,500/mo',
    deposit: '₹10,000',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    desc: 'Your own private space with attached bathroom, study desk, and wardrobe. Maximum privacy and comfort.',
    bedsPerRoom: 1,
    rooms: [
      { id: 'R101', floor: '1st Floor', occupiedBeds: 0 },
      { id: 'R102', floor: '1st Floor', occupiedBeds: 1 },
    ],
  },
  '2-sharing': {
    title: '2 Sharing — Popular',
    tag: 'Most Popular',
    tagColor: 'bg-pink-100 text-pink-600',
    price: '₹6,000/mo',
    deposit: '₹8,000',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
    desc: 'Share with one roommate. Spacious room with individual storage, AC, and great natural light.',
    bedsPerRoom: 2,
    rooms: [
      { id: 'R201', floor: '2nd Floor', occupiedBeds: 1 },
      { id: 'R202', floor: '2nd Floor', occupiedBeds: 2 },
    ],
  },
  '3-sharing': {
    title: '3 Sharing',
    tag: 'Affordable',
    tagColor: 'bg-orange-100 text-orange-600',
    price: '₹5,000/mo',
    deposit: '₹6,000',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    desc: 'Affordable triple-sharing with personal lockers, ceiling fans, and a friendly community vibe.',
    bedsPerRoom: 3,
    rooms: [
      { id: 'R301', floor: '3rd Floor', occupiedBeds: 1 },
      { id: 'R302', floor: '3rd Floor', occupiedBeds: 3 },
      { id: 'R303', floor: '3rd Floor', occupiedBeds: 2 },
      { id: 'R304', floor: '3rd Floor', occupiedBeds: 0 },
      { id: 'R305', floor: '3rd Floor', occupiedBeds: 3 },
    ],
  },
  '4-sharing': {
    title: '4 Sharing — Budget',
    tag: 'Best Value',
    tagColor: 'bg-green-100 text-green-600',
    price: '₹4,000/mo',
    deposit: '₹5,000',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    desc: 'Most economical option. Great for students who want to save while enjoying all HKPG amenities.',
    bedsPerRoom: 4,
    rooms: [
      { id: 'R401', floor: '4th Floor', occupiedBeds: 2 },
      { id: 'R402', floor: '4th Floor', occupiedBeds: 4 },
    ],
  },
}

// Helper: compute totals for a room type
export function getRoomStats(typeKey) {
  const type = roomsData[typeKey]
  const totalRooms = type.rooms.length
  const totalBeds = totalRooms * type.bedsPerRoom
  const occupiedBeds = type.rooms.reduce((sum, r) => sum + r.occupiedBeds, 0)
  const vacantBeds = totalBeds - occupiedBeds
  const vacantRooms = type.rooms.filter(r => r.occupiedBeds < type.bedsPerRoom).length
  return { totalRooms, totalBeds, occupiedBeds, vacantBeds, vacantRooms }
}
