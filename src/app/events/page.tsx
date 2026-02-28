import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/queries'
import { Calendar, MapPin, Clock, Globe } from 'lucide-react'
import { format } from 'date-fns'

export default async function EventsPage() {
  const events = await getUpcomingEvents(50)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              🚀 Product Hub
            </Link>
            <Link href="/events/submit" className="btn btn-primary">
              Create Event
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🎉 Product Launch Events</h1>
          <p className="text-xl text-gray-600">
            Join virtual and in-person events to discover new products
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Event Image */}
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center text-white text-6xl">
                    📅
                  </div>
                )}

                <div className="p-6">
                  {/* Virtual Badge */}
                  {event.virtual && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3">
                      🌐 Virtual Event
                    </span>
                  )}

                  <h3 className="text-2xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(event.startDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {format(new Date(event.startDate), 'h:mm a')} -{' '}
                        {format(new Date(event.endDate), 'h:mm a')}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.region && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>{event.region}</span>
                      </div>
                    )}
                  </div>

                  {/* Featured Products */}
                  {event.products && event.products.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Featured Products:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {event.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
                          >
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {event.eventUrl ? (
                    <a
                      href={event.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full text-center"
                    >
                      Register Now
                    </a>
                  ) : (
                    <button className="btn btn-secondary w-full" disabled>
                      Registration Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No upcoming events</p>
            <p className="text-gray-400 mt-2">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
