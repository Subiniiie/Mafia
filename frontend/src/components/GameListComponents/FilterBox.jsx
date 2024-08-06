import { useState } from 'react';
import Filter from './Filter';

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
        <div>
            <div>
                <div>
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
                </div>
            </div>

            <div>
                <div>
                    <Filter
                        label="임무 시작 전"
                        value="preMission"
                        onChange={handleCheckboxChange}
                    />
                </div>
            </div>
        </div>

    );
};

export default FilterBox;