import Link from 'next/link'
const { NEXT_PUBLIC_REACT_APP_API } = process.env

const DiscoveryItem = ({ discovery }) => {
    const { image, slug, title, brief_description } = discovery;
    const bkImage = `${NEXT_PUBLIC_REACT_APP_API}/uploads/discovery/${image}`

    return (
        <Link href={`/kham-pha/${slug}`}>
            <div className='discovery-item'>

                <div className="discovery-item-content" style={{ backgroundImage: `url(${bkImage})` }}>

                </div >
                <div className='discovery-name'>
                    <a>{title}</a>
                </div>

                <div dangerouslySetInnerHTML={{ __html: brief_description }} className='discovery-brief-description' />

            </div>
        </Link >
    )
}

export default DiscoveryItem