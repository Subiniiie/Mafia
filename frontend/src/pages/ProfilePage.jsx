import React, { useState } from "react";
import styles from "./ProfilePage.module.css";

function ProfilePage() {

    // 사용자 정보를 state로 관리
    const [user, setUser] = useState({
        name: "홍길동",
        email: "hong@gil.dong",
        age: 30
    });

    // 수정 모드 상태
    const [editMode, setEditMode] = useState(false);

    // 사용자 입력을 핸들링하는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        setEditMode(false); // 수정 모드 종료
    };

    // 수정 모드 활성화
    const handleEdit = () => {
        setEditMode(true);
    };

    return (
        <div className={styles.profilePage}>
            <h2 className={styles.heading}>회원 정보</h2>
            {!editMode ? (
                <div className={styles.profileInfo}>
                    <div className={styles.infoBox}>
                        <p>이름: {user.name}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <p>이메일: {user.email}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <p>나이: {user.age}</p>
                    </div>
                    <button onClick={handleEdit} className={styles.editButton}>회원정보 수정</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        이름:
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </label>
                    <br />
                    <label>
                        이메일:
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </label>
                    <br />
                    <label>
                        나이:
                        <input
                            type="number"
                            name="age"
                            value={user.age}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </label>
                    <br />
                    <button type="submit" className={styles.saveButton}>저장</button>
                </form>
            )}
        </div>
    )
}

export default ProfilePage;
