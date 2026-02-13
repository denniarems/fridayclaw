import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Activities } from '../components/Activities';
import { Timeline } from '../components/Timeline';
import { Thoughts } from '../components/Thoughts';

const IndexComponent = () => {
  return (
    <>
      <Hero />
      <About />
      <Activities />
      <Timeline />
      <Thoughts />
    </>
  );
};

export const Route = createFileRoute('/')({
  component: IndexComponent,
});
