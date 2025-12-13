const Description = ({ land }) => {

  return (
    <section className="land-single-description">
      <div dangerouslySetInnerHTML={{ __html: land.description }} />
    </section>
  );
};

export default Description;
