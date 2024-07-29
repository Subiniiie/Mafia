import React from "react";

function FriendsAddTab() {
    // 내가 받은 친구 요청
    // 수락하면 어쩔거고 차단하면 어쩔건지??
    const friendsRequest = [
        {'닉네임': '송희', '차단': false, '친구': false},
        {'닉네임': '현우', '차단': false, '친구': false},
        {'닉네임': '강진', '차단': false, '친구': false},
        {'닉네임': '종훈', '차단': false, '친구': false},
        {'닉네임': '수빈', '차단': false, '친구': false},
    ]
    return (
        <>
        <ul>
            {friendsRequest.map((friend, index) => (
                <li key={index}>
                    {friend['친구'] ? null : (
                        <>{friend['닉네임']} <button>수락</button> <button>차단</button></>
                    )}
                </li>
            ))}
        </ul>
        </>
    )
}

export default FriendsAddTab;