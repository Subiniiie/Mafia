import PropTypes from 'prop-types';
import styles from './Filter.module.css'; // 스타일 파일을 별도로 관리합니다.

const Filter = ({ label, value, onChange }) => {
    return (
        <label className={styles.filterLabel}>
            <input
                type="checkbox"
                value={value}
                onChange={onChange}
            />
            {label}
        </label>
    );
};

Filter.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Filter;