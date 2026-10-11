function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__brand">Little Lemon</p>
          <p>Family-owned Mediterranean restaurant in Chicago.</p>
        </div>

        <div>
          <h2 className="site-footer__heading">Opening hours</h2>
          <ul className="plain-list">
            <li>Mon – Thu: 5:00 PM – 10:00 PM</li>
            <li>Fri – Sun: 5:00 PM – 11:00 PM</li>
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">Contact</h2>
          <address>
            123 Citrus Street
            <br />
            Chicago, IL 60601
            <br />
            <a href="tel:+13125550123">(312) 555-0123</a>
            <br />
            <a href="mailto:hello@littlelemon.example">hello@littlelemon.example</a>
          </address>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>
          &copy; {year} Little Lemon. Demo project: the address, phone number, and email are
          fictional.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
