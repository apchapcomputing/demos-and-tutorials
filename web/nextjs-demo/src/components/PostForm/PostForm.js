import styles from './PostForm.module.scss';

const PostForm = () => {
    return (
        <form>
            <textarea className={styles.formContent}></textarea>
            <button className={styles.formSubmit}>Add New Post</button>
        </form>
    );
};

export default PostForm;
