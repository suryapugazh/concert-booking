import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from '@/database';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  
  return (
    <section>

      <h1 className='text-center'> The hub for every <strong>Melophile</strong> <br /> Concert You Can't Miss </h1>
      <p className='text-center mt-5'>Concerts, Audio Launches and more! All in One Place</p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        <ul className='events'>
          {events && events.length > 0 && events.map((event: IEvent) => (
            <ol key={event.title}>
              <EventCard {...event}/>
            </ol>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page