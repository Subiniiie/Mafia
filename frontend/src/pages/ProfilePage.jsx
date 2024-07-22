import React from "react";
import { Link } from "react-router-dom";

function ProfilePage() {
    return (
        <>
            <p>프로필 페이지</p>
            <ul>
                <li><Link to="/achievements">업적 페이지</Link></li>
                <li><Link to="/profile">프로필 페이지</Link></li>
            </ul>
        </>
    )
}

export default ProfilePage;