import React from "react";
import SearchBar from "../components/GameListComponents/SearchBar";

function FriendsSearchTab() {
    // 랜덤으로 친구를 보여줌?
    // 검색하면 친구를 찾을 수 있음
    // 모든 회원의 정보?
    const searchFriends = [
        {'닉네임': '송희', '차단': false, '친구': false},
        {'닉네임': '현우', '차단': false, '친구': false},
        {'닉네임': '강진', '차단': false, '친구': false},
        {'닉네임': '종훈', '차단': false, '친구': true},
        {'닉네임': '수빈', '차단': false, '친구': true},
    ]
    return (
        <>
            <ul>
                {searchFriends.map((friend, index) => (
                    <li key={index}>
                        {friend['친구'] ? null : (
                            <>{friend['닉네임']} <button>동지 요청</button></>
                        )}
                    </li>
                ))}
            </ul>
            <SearchBar />
        </>
    )
}

export default FriendsSearchTab;