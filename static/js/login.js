window.onload = async function () {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');

    
    const accessToken = localStorage.getItem('accessToken');
}


document.getElementById("login-form").addEventListener('submit', async function(event){
    event.preventDefault();

    const userData = {
        username: document.getElementById("floatingname").value,
        password: document.getElementById("floatingPassword").value
    };

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        if (response.ok){
            const responseData = await response.json();
            const accessToken = responseData.access_token;
            const refreshToken = responseData.refresh_token;
            const role = responseData.role;

            console.log(responseData,"**************responseData*********8")

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', role);

            window.location.href = `/`;
            
        } else {
            const errorData = await response.json();
            alert(errorData.detail);
        }

    } catch(error) {
        console.log('Error:', error);
    }
})
