import Home from '@/components/Home/Home';
import About from '@/components/About/About';
import Projects from '@/components/Projects/Project';
import Globe from '@/components/Globe/Globe';
import Certificate from '@/components/Certificate/Certificate';
import Contacts from '@/components/Contacts/Contact';

export default function Page() {
  return (
    <main>
      <section id="Home" className="section"><Home /></section>
      <section id="About" className="section"><About /></section>
      <section id="Universe" className="section" style={{ background: '#000', minHeight: '600px' }}>
        <Globe />
      </section>
      <section id="Projects" className="section dark"><Projects /></section>
      <section id="certificate" className="section dark"><Certificate /></section>
      <section id="Contact" className="section dark"><Contacts /></section>
    </main>
  );
}