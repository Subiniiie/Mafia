import { useState } from 'react';
import Filter from './Filter';
import styles from './FilterBox.module.css'; // 스타일 파일을 별도로 관리합니다.

const FilterBox = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setSelectedFilters((prevSelectedFilters) => {
            if (checked) {
                // 추가
                return [...prevSelectedFilters, value];
            } else {
                // 제거
                return prevSelectedFilters.filter((filter) => filter !== value);
            }
        });
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.checkboxContainer}>
                <Filter
                    label="공개 임무"
                    value="publicMission"
                    onChange={handleCheckboxChange}
                />
                <Filter
                    label="극비 임무"
                    value="secretMission"
                    onChange={handleCheckboxChange}
                />
                <Filter
                    label="임무 시작 전"
                    value="preMission"
                    onChange={handleCheckboxChange}
                />
            </div>
        </div>
    );
};

export default FilterBox;
