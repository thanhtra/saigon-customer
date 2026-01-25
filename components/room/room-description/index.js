const Description = ({ room }) => {

  return (
    <section className="room-summary-card room-description">
      <div dangerouslySetInnerHTML={{ __html: room.description }} />
    </section>
  );
};

export default Description;
