const DiscoveryDescription = ({ discovery }) => {

  return (
    <section className="discovery-single-description">
      <div dangerouslySetInnerHTML={{ __html: discovery.brief_description }} />
      <br />
      <div dangerouslySetInnerHTML={{ __html: discovery.description }} />
    </section>
  );
};

export default DiscoveryDescription;
