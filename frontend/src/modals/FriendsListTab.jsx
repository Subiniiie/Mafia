import React from "react";
import SearchBar from "../components/GameListComponents/SearchBar";

function FriendsListTab() {
    // 친구 목록 데이터를 받아와야함
    // 일단은 임시로 작성
    const myfriends = [
        {'닉네임': '송희', '차단': false, '친구': true},
        {'닉네임': '현우', '차단': false, '친구': true},
        {'닉네임': '강진', '차단': false, '친구': true},
        {'닉네임': '종훈', '차단': false, '친구': true},
        {'닉네임': '수빈', '차단': false, '친구': true},
    ]
    return (
        <>
            <ul>
                {myfriends.map((friend, index) => (
                    <li key={index}>
                        {friend['차단'] ? null : (
                            <>{friend['닉네임']} <button>차단</button></>
                            )
                        }
                    </li>
                ))}
            </ul>
            <SearchBar placeholder="동지 이름을 입력해주세요."/>
        </>
    )
}

export default FriendsListTab;