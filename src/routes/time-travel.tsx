import { createFileRoute } from '@tanstack/react-router';
import { TimeTravel } from '../pages/TimeTravel';

function TimeTravelComponent() {
  return (
    <div className="pt-16">
      <TimeTravel />
    </div>
  );
}

export const Route = createFileRoute('/time-travel')({
  component: TimeTravelComponent,
});
