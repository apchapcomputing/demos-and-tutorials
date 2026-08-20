import React from 'react';

import Bio from './Bio';

export default {
    title: 'Components/Bio',
    component: Bio,
};

const Template = () => (
    <Bio
        headshot='https://pbs.twimg.com/profile_images/1425580604104585216/ntDPRTIV_400x400.jpg'
        name='Ashlyn Chapman'
        tagline='Construct Curiosity'
        role='Computer Science Undergrad @ NCSU'
    />
);

export const Default = Template.bind({});
