function logout() {
    firebase.auth().singOut().then(() => {
        window.location.href = ""
    })
}