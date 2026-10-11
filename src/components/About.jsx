const highlights = [
  {
    title: "Fresh ingredients",
    text: "We cook with seasonal vegetables, olive oil, herbs, and lemons from local suppliers.",
  },
  {
    title: "Family recipes",
    text: "Dishes passed down through generations, prepared the way our grandparents made them.",
  },
  {
    title: "Warm atmosphere",
    text: "Sit indoors, on our sunny patio, or at the bar. Perfect for dinners, birthdays, and celebrations.",
  },
];

function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <h2 id="about-heading" className="section__title">
          Why people love Little Lemon
        </h2>
        <ul className="highlights">
          {highlights.map((item) => (
            <li key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default About;
