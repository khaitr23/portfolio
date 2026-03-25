import { getContent } from "@/lib/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  const content = getContent();
  return (
    <main>
      <Nav />
      <Hero data={content.hero} />
      <About data={content.about} coursework={content.skills.coursework} />
      <Experience data={content.experience} />
      <Projects data={content.projects} />
      <Skills data={content.skills} />
      <Contact data={content.contact} email={content.hero.email} github={content.hero.github} linkedin={content.hero.linkedin} />
      <Footer />
    </main>
  );
}
