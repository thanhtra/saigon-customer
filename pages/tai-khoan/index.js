import Breadcrumb from 'components/common/breadcrumb';
import Account from "components/profile/account";
import Address from "components/profile/address";
import ChangePassword from "components/profile/change-password";
import ProfileFilter from 'components/profile/filter';
import ManageOrder from "components/profile/manage-order";
import { PageUrl, ProfileTab } from 'lib/constants/tech';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import ManagePostLand from 'components/profile/manage-post-land';
import ManagePostProduct from 'components/profile/manage-post-product';

const ProfilePage = () => {
    const router = useRouter();
    const { tab } = router.query;
    const [activeTab, setActiveTab] = useState('')

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab(ProfileTab.account);
        }
    }, [tab]);

    const editLandHandle = (val) => {
        router.push(`${PageUrl.PostLand}?slug=${val}`)
    }

    const editProductHandle = (val) => {
        router.push(`${PageUrl.PostProduct}?slug=${val}`)
    }

    return (
        <>
            <section className="container profile-page">
                <Breadcrumb title={'Tài khoản'} />

                <div className="profile-main">
                    <div className="profiles-filter">
                        <ProfileFilter tab={tab} />
                    </div>

                    <div className="profile-content">
                        {activeTab === ProfileTab.Account && <Account />}
                        {activeTab === ProfileTab.ManageBooking && <ManageOrder />}
                        {activeTab === ProfileTab.ManagePostRental && <ManagePostLand editLand={editLandHandle} />}
                        {activeTab === ProfileTab.ManagePostLand && <ManagePostLand editLand={editLandHandle} />}
                        {activeTab === ProfileTab.ManagePostProduct && <ManagePostProduct editProduct={editProductHandle} />}
                        {activeTab === ProfileTab.ChangePassword && <ChangePassword />}
                    </div>
                </div>
            </section>
        </ >
    )
}

export default ProfilePage
