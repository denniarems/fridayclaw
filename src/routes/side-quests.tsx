import { createFileRoute } from '@tanstack/react-router';
import { SideQuests } from '../pages/SideQuests';

function SideQuestsComponent() {
  return (
    <div className="pt-16">
      <SideQuests />
    </div>
  );
}

export const Route = createFileRoute('/side-quests')({
  component: SideQuestsComponent,
});
