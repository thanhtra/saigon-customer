const Description = ({ land }) => {

  return (
    <section className="land-summary-card land-description">
      <div dangerouslySetInnerHTML={{ __html: land.description }} />
    </section>
  );
};

export default Description;
