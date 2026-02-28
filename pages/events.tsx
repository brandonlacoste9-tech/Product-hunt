import Head from 'next/head'
import Layout from '../components/layout/Layout'

const events = [
  {
    id: 1,
    title: 'North America Demo Day',
    date: '2024-03-15',
    time: '2:00 PM EST',
    type: 'Virtual',
    description: 'Watch 10 startups present their products. Vote for your favorite!',
    attendees: 234,
  },
  {
    id: 2,
    title: 'San Francisco Product Meetup',
    date: '2024-03-20',
    time: '6:00 PM PST',
    type: 'In-Person',
    location: 'San Francisco, CA',
    description: 'Connect with local founders and product makers.',
    attendees: 45,
  },
  {
    id: 3,
    title: 'Toronto Tech Tuesday',
    date: '2024-03-22',
    time: '7:00 PM EST',
    type: 'In-Person',
    location: 'Toronto, ON',
    description: 'Monthly gathering of Toronto tech community.',
    attendees: 38,
  },
]

const upcomingLaunches = [
  {
    id: 1,
    product: 'NextGen AI Tools',
    date: '2024-03-10',
    time: '9:00 AM EST',
    maker: 'Sarah Johnson',
  },
  {
    id: 2,
    product: 'CloudFlow Platform',
    date: '2024-03-12',
    time: '10:00 AM PST',
    maker: 'Michael Chen',
  },
  {
    id: 3,
    product: 'DesignHub Pro',
    date: '2024-03-14',
    time: '2:00 PM EST',
    maker: 'Emily Rodriguez',
  },
]

export default function Events() {
  return (
    <Layout>
      <Head>
        <title>Events & Launches - Discover North America</title>
        <meta name="description" content="Join virtual and in-person events. Watch live product launches and connect with the maker community." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">📅 Events & Product Launches</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Join live events, watch product launches, and connect with makers across North America.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.type === 'Virtual' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-sm text-gray-500">{event.attendees} attending</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </div>
                  )}
                </div>

                <button className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition">
                  RSVP
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Calendar */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">🚀 Upcoming Product Launches</h2>
          <div className="space-y-4 max-w-3xl">
            {upcomingLaunches.map(launch => (
              <div key={launch.id} className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{launch.product}</h3>
                  <p className="text-gray-600 text-sm">by {launch.maker}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{new Date(launch.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-600">{launch.time}</div>
                  <button className="mt-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Get Notified →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Host Your Own Event</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Want to organize a demo day or local meetup? We'll help you promote it to our community.
          </p>
          <button className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition">
            Submit Event
          </button>
        </div>
      </section>
    </Layout>
  )
}
