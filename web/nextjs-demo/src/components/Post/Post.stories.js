import React from 'react';

import Post from './Post';

export default {
    title: 'Components/Post',
    component: Post,
};

const Template = () => (
    <Post
        content='I am a dummy template for Storybooking my React components'
        date='12/17/2020'
    />
);

export const Default = Template.bind({});
