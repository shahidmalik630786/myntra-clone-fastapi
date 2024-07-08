
//register
document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userData = {
        username: document.getElementById("floatingname").value,
        email: document.getElementById("floatingemail").value,
        password: document.getElementById("floatingPassword").value
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/api/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            const errorData = await response.json();
            alert(errorData.detail);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});





















































