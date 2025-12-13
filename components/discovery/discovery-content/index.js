
const DiscoveryContent = ({ discovery = {} }) => {
    const { title, district, brief_description } = discovery

    return (
        <section className="brief-content">
            <h2 className="brief-content-name">{title}</h2>
            {/* 
            <div className="brief-content-detail">
                <p className='infor'><span className='title'>Địa chỉ: {district} - Đăk Nông</span></p>
            </div>

            <div dangerouslySetInnerHTML={{ __html: brief_description }} /> */}
        </section>
    );
};

export default DiscoveryContent
