import Breadcrumb from 'components/common/breadcrumb';
import Account from "components/profile/account";
import ChangePassword from "components/profile/change-password";
import ProfileFilter from 'components/profile/filter';
import ManageBooking from "components/profile/manage-booking";
import ManageMyHouses from 'components/profile/manage-my-houses';
import ManageCustomers from 'components/profile/manage-customers';
import { PageUrl, ProfileTab } from 'lib/constants/tech';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
    const router = useRouter();
    const { tab } = router.query;

    const { user } = useSelector((state) => state.users);
    const isLoggedIn = !!user && Object.keys(user).length > 0;

    const [activeTab, setActiveTab] = useState('')

    useEffect(() => {
        if (!isLoggedIn) {
            router.replace(PageUrl.Login);
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        if (!tab) {
            setActiveTab(ProfileTab.Account);
        } else {
            setActiveTab(tab);
        }
    }, [tab]);

    if (!isLoggedIn) return null;

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
                        {activeTab === ProfileTab.ManageCustomers && <ManageCustomers />}
                        {activeTab === ProfileTab.ManagePostRental && <ManageMyHouses />}
                        {activeTab === ProfileTab.ChangePassword && <ChangePassword />}
                    </div>
                </div>
            </section>
        </ >
    )
}

export default ProfilePage
