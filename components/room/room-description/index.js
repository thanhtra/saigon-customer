const Description = ({ room }) => {

  return (
    <section className="room-single-description">
      <div dangerouslySetInnerHTML={{ __html: room.description }} />
    </section>
  );
};

export default Description;
