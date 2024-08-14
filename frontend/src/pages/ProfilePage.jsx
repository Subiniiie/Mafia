import { useState, useEffect } from "react";
import axios from "axios"
import classNames from "classnames"
import styles from "./ProfilePage.module.css";

function ProfilePage() {

    // 사용자 정보를 state로 관리
    const [user, setUser] = useState({
        name: "",
        email: "",
    });

    // 수정 모드 상태
    const [editMode, setEditMode] = useState(false);

    // 비밀번호 입력 상태
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordVerified, setPasswordVerified] = useState(false)

    // 사용자 정보를 가져오는 함수
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const access = localStorage.getItem('access')
                const response = await axios.get('https://i11e106.p.ssafy.io/api/users', {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access}`,
                    }
                })
                setUser(response.data.data)
            } catch (error) {
                console.error("Failed to fetch user data:", error)
            }
        }
        fetchUserData()
    }, [])

    // 수정 모드 활성화
    const handleEdit = () => {
        setEditMode(true)
    }


    // 사용자 입력을 핸들링하는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const access = localStorage.getItem('access')
            const response = await axios.patch('https://i11e106.p.ssafy.io/api/users', {
                username: user.username,
                email: user.email
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
            })

            console.log('Updated user:', response.data.data)

            // 업데이트 된 데이터를 UI에 반영
            setUser(response.data.data)
            setEditMode(false) // 수정 모드 종료
        } catch (error) {
            console.error("Failed to update user data:", error)
        }
    };


    const ProfileClass = classNames('kimjungchul-gothic-regular', styles.container)

    return (
        <div className={ProfileClass}>
            <div className={styles.containerMini}>
                <div className={styles.heading}>입단 정보</div>
                {!editMode ? (
                    <div className={styles.profileInfo}>
                        <div className={styles.infoBox}>
                            <p>이름: {user.username}</p>
                        </div>
                        <div className={styles.infoBox}>
                            <p>이메일: {user.email}</p>
                        </div>
                        <button onClick={handleEdit} className={styles.editButton}>회원정보 수정</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.profileInfo}>
                        <div className={styles.infoBox}>
                            <label>
                                이름:
                                <input
                                    type="text"
                                    name="name"
                                    value={user.username}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </label>
                        </div>
                        <div className={styles.infoBox}>

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
                        </div>

                        <button type="submit" className={styles.saveButton}>저장</button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ProfilePage;
