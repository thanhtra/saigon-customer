const Description = ({ room }) => {

  return (
    <section className="room-summary-card">
      <div dangerouslySetInnerHTML={{ __html: room.description }} />
    </section>
  );
};

export default Description;
