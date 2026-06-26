import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const events = [
  {
    title: "Hackathon 2026",
    date: "10 Aug 2026",
    venue: "Main Auditorium",
  },
  {
    title: "AI Workshop",
    date: "15 Aug 2026",
    venue: "Seminar Hall",
  },
  {
    title: "Cricket Tournament",
    date: "20 Aug 2026",
    venue: "College Ground",
  },
];

export default function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {events.map((event) => (
          <div
            key={event.title}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition"
          >
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {event.date}
              </p>
            </div>

            <span className="text-sm text-blue-600">
              {event.venue}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}