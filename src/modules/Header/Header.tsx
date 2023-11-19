import AddDrawer from '../AddDrawer/AddDrawer';
import * as React from 'react';
import { Profile } from '../Profile/Profile';

export const Header: React.FC = () => {
    return (
        <div className="header">
            <div>Кабэ в России и мире</div>
            <div className="addDrawer">
                <AddDrawer />
            </div>
            <Profile />
        </div>
    );
};
