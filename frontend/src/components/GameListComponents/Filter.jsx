import PropTypes from 'prop-types';
import styles from "./Filter.module.css";

const Filter = ({ label, value, onChange }) => {
    return (
        <div className={styles.filterBox}>
            {/* <label> */}
            <input
                type="checkbox"
                value={value}
                onChange={onChange}
            />
            {/* {label} */}
            {/* </label> */}
            {label}
        </div>
    );
};

Filter.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Filter;