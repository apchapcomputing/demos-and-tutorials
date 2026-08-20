import { FaHeart, FaShareAlt } from 'react-icons/fa';

import styles from './Post.module.scss';

const Post = ({ content, date }) => {
    return (
        <>
            <p className={styles.postsContent}>{content}</p>
            <ul className={styles.postsMeta}>
                <li className={styles.postsMetaData}>
                    <FaHeart />
                </li>
                <li className={styles.postsMetaData}>
                    <FaShareAlt />
                </li>
                <li className={styles.postsMetaData}>{date}</li>
            </ul>
        </>
    );
};

export default Post;
