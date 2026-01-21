import Breadcrumb from 'components/common/breadcrumb';
import Account from "components/profile/account";
import ChangePassword from "components/profile/change-password";
import ProfileFilter from 'components/profile/filter';
import ManageBooking from "components/profile/manage-booking";
import ManageMyHouses from 'components/profile/manage-my-houses';
import { PageUrl, ProfileTab } from 'lib/constants/tech';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
    const router = useRouter();
    const { tab } = router.query;
    const [activeTab, setActiveTab] = useState('')

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab(ProfileTab.Account);
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
                        {activeTab === ProfileTab.ManageBooking && <ManageBooking />}
                        {activeTab === ProfileTab.ManagePostRental && <ManageMyHouses />}
                        {activeTab === ProfileTab.ChangePassword && <ChangePassword />}
                    </div>
                </div>
            </section>
        </ >
    )
}

export default ProfilePage
