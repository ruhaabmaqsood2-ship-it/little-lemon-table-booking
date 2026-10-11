function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="eyebrow">Chicago</p>
          <h1 id="hero-heading">Little Lemon</h1>
          <p className="hero__lead">
            A family-owned Mediterranean restaurant serving traditional recipes with a modern
            twist. Fresh ingredients, warm service, and a table waiting for you.
          </p>
          <a className="button" href="#reservations">
            Reserve a table
          </a>
        </div>
        <div className="hero__image">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
            alt="A beautifully plated Mediterranean dinner on a restaurant table"
            width="900"
            height="600"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
