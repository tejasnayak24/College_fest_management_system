import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-full bg-blue-100 p-4">
          <Icon className="text-blue-600" size={28} />
        </div>
      </CardContent>
    </Card>
  );
}