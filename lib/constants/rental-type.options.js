import React from 'react';
import { RentalType, RentalTypeLabels, RentalTypeIcons } from './data';

export const RentalTypeOptions = Object.values(RentalType).map((type) => {
    const Icon = RentalTypeIcons[type];

    return {
        value: type,
        label: RentalTypeLabels[type],
        icon: Icon ? <Icon size={28} /> : null,
    };
});
